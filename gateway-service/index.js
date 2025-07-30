const express = require("express");
const httpProxy = require("express-http-proxy");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.API_KEY || "your-secret-api-key";
const PING_TIMEOUT = 5000; // 5 secondes

// Configuration des services dans un tableau
const services = [
  {
    name: "users",
    url: process.env.USER_SERVICE_URL || "http://localhost:4001",
    path: "/users",
    apiPath: "/api/v1/users",
    healthCheck: "/ping",
    timeout: 5000,
  },
  {
    name: "admin",
    url: process.env.ADMIN_SERVICE_URL || "http://localhost:4002",
    path: "/admin",
    apiPath: "/api/v1/admin",
    healthCheck: "/ping",
    timeout: 5000,
  },
  {
    name: "payments",
    url: process.env.PAYMENT_SERVICE_URL || "http://localhost:4003",
    path: "/payments",
    apiPath: "/api/v1/payments",
    healthCheck: "/ping",
    timeout: 5000,
  },
  {
    name: "files",
    url: process.env.FILE_SERVICE_URL || "http://localhost:4004",
    path: "/files",
    apiPath: "/api/v1/files",
    healthCheck: "/ping",
    timeout: 5000,
  },
];

// Middleware de sécurité
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("combined"));

const authenticateRequest = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (req.path === "/health" || req.path.startsWith("/api-docs")) {
    return next();
  }

  if (!apiKey || apiKey !== API_KEY) {
    console.warn(`Unauthorized access attempt from ${req.ip} to ${req.path}`);
    return res.status(401).json({
      error: "Unauthorized",
      message: "Valid x-api-key header required",
    });
  }

  next();
};

app.use(authenticateRequest);

// Fonction pour ping un service
const pingService = async (service) => {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PING_TIMEOUT);

    const response = await fetch(`${service.url}${service.healthCheck}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const responseTime = Date.now() - startTime;

    return {
      name: service.name,
      status: response.ok ? "up" : "down",
      url: service.url,
      responseTime,
      statusCode: response.status,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      name: service.name,
      status: "down",
      url: service.url,
      responseTime: Date.now() - startTime,
      error: error.name === "AbortError" ? "Connection timeout" : error.message,
      lastChecked: new Date().toISOString(),
    };
  }
};

// Health check endpoint global
app.get("/health", async (req, res) => {
  try {
    console.log("Performing health check on all services...");

    // Ping tous les services en parallèle
    const serviceChecks = await Promise.all(
      services.map((service) => pingService(service))
    );

    const healthStatus = {
      gateway: {
        status: "up",
        version: process.env.VERSION || "1.0.0",
        port: PORT,
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      services: serviceChecks,
      summary: {
        total: serviceChecks.length,
        up: serviceChecks.filter((s) => s.status === "up").length,
        down: serviceChecks.filter((s) => s.status === "down").length,
      },
    };

    const overallStatus = healthStatus.summary.down === 0 ? 200 : 207; // 207 Multi-Status si certains services sont down
    res.status(overallStatus).json(healthStatus);
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      error: "Health check failed",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Configuration des proxies pour chaque service
services.forEach((service) => {
  console.log(
    `Setting up proxy for ${service.name}: ${service.apiPath} -> ${service.url}`
  );

  // Proxy pour les routes API v1
  app.use(
    service.apiPath,
    httpProxy(service.url, {
      timeout: service.timeout,
      proxyReqPathResolver: (req) => {
        // Retire /api/v1/servicename du path et le redirige vers le service
        const newPath = req.url.replace(service.apiPath, service.path);
        console.log(
          `[${service.name.toUpperCase()}] Proxying: ${req.originalUrl} -> ${
            service.url
          }${newPath}`
        );
        return newPath;
      },
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // Transmet les headers importants
        proxyReqOpts.headers["x-api-key"] = API_KEY;
        proxyReqOpts.headers["x-forwarded-for"] = srcReq.ip;
        proxyReqOpts.headers["x-forwarded-host"] = srcReq.get("host");
        return proxyReqOpts;
      },
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        // Log des réponses
        console.log(
          `[${service.name.toUpperCase()}] Response: ${proxyRes.statusCode}`
        );
        return proxyResData;
      },
    })
  );

  // Proxy pour la documentation Swagger de chaque service
  app.use(
    `/api-docs/${service.name}`,
    httpProxy(service.url, {
      timeout: service.timeout,
      proxyReqPathResolver: (req) => {
        const newPath = `/api-docs${req.url}`;
        console.log(
          `[${service.name.toUpperCase()}] Swagger docs: ${
            req.originalUrl
          } -> ${service.url}${newPath}`
        );
        return newPath;
      },
    })
  );
});

// Route pour lister tous les services disponibles
app.get("/api/v1/services", (req, res) => {
  const servicesList = services.map((service) => ({
    name: service.name,
    apiPath: service.apiPath,
    docsPath: `/api-docs/${service.name}`,
    healthCheck: `${service.apiPath}/ping`,
  }));

  res.json({
    gateway: {
      version: process.env.VERSION || "1.0.0",
      port: PORT,
    },
    services: servicesList,
    healthCheck: "/health",
  });
});

// Route racine avec information sur l'API Gateway
app.get("/", (req, res) => {
  res.json({
    message: "API Gateway is running",
    version: process.env.VERSION || "1.0.0",
    endpoints: {
      health: "/health",
      services: "/api/v1/services",
      docs: "/api-docs",
    },
    services: services.map((s) => s.apiPath),
  });
});

// Documentation Swagger globale
app.get("/api-docs", (req, res) => {
  const docsLinks = services.map((service) => ({
    service: service.name,
    docs: `${req.protocol}://${req.get("host")}/api-docs/${service.name}`,
  }));

  res.json({
    message: "API Documentation",
    services: docsLinks,
  });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error("Gateway error:", err);
  res.status(500).json({
    error: "Internal Gateway Error",
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

// Gestion des routes non trouvées
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The requested route ${req.originalUrl} was not found`,
    availableServices: services.map((s) => s.apiPath),
  });
});

// Démarrage du serveur
const startServer = () => {
  app.listen(PORT, async () => {
    console.log(` API Gateway running on port ${PORT}`);
    console.log(` Health check available at: http://localhost:${PORT}/health`);
    console.log(`📚 API docs available at: http://localhost:${PORT}/api-docs`);
    console.log(
      `Services list available at: http://localhost:${PORT}/api/v1/services`
    );

    // Ping initial des services
    console.log("\n🔍 Checking services health...");
    const checks = await Promise.all(services.map(pingService));
    checks.forEach((check) => {
      const status = check.status === "up" ? "✅" : "❌";
      console.log(
        `${status} ${check.name}: ${check.status} (${check.responseTime}ms)`
      );
    });
    console.log("\n");
  });
};

startServer();

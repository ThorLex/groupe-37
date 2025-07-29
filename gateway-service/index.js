const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.GATEWAY_PORT || 4000;
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const authenticateRequest = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (req.path === "/health" || req.path.startsWith("/api/docs")) {
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

// Configuration des proxies pour chaque service avec http-proxy-middleware
services.forEach((service) => {
  console.log(
    `Setting up proxy for ${service.name}: ${service.apiPath} -> ${service.url}`
  );

  // Proxy pour les routes API v1
  const apiProxy = createProxyMiddleware({
    target: service.url,
    changeOrigin: true,
    timeout: service.timeout,
    pathRewrite: {
      [`^${service.apiPath}`]: service.path, // Remplace /api/v1/servicename par /servicename
    },

    // Gestion des requêtes sortantes
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[${service.name.toUpperCase()}] Proxying: ${req.method} ${
          req.originalUrl
        } -> ${service.url}${service.path}${req.url.replace(
          service.apiPath,
          ""
        )}`
      );

      // Ajout des headers nécessaires
      proxyReq.setHeader("x-api-key", API_KEY);
      proxyReq.setHeader("x-forwarded-for", req.ip);
      proxyReq.setHeader("x-forwarded-host", req.get("host"));

      // Gestion du body pour les requêtes POST/PUT
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    // Gestion des réponses
    onProxyRes: (proxyRes, req, res) => {
      console.log(
        `[${service.name.toUpperCase()}] Response: ${proxyRes.statusCode} for ${
          req.method
        } ${req.originalUrl}`
      );

      // Ajout des headers CORS si nécessaire
      proxyRes.headers["Access-Control-Allow-Origin"] =
        process.env.CORS_ORIGIN || "*";
      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    },

    // Gestion des erreurs
    onError: (err, req, res) => {
      console.error(
        `[${service.name.toUpperCase()}] Proxy error:`,
        err.message
      );
      if (!res.headersSent) {
        res.status(502).json({
          error: "Service Unavailable",
          message: `Unable to reach ${service.name} service`,
          service: service.name,
          timestamp: new Date().toISOString(),
        });
      }
    },

    logLevel: process.env.NODE_ENV === "development" ? "debug" : "warn",
  });

  app.use(service.apiPath, apiProxy);

  // Proxy pour la documentation Swagger de chaque service
  const docsProxy = createProxyMiddleware({
    target: service.url,
    changeOrigin: true,
    timeout: service.timeout,
    pathRewrite: {
      [`^/api/docs/${service.name}`]: "/api/docs", // Redirige vers /api-docs du service
    },

    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[${service.name.toUpperCase()}] Swagger docs: ${req.originalUrl} -> ${
          service.url
        }/api/docs`
      );
    },

    onError: (err, req, res) => {
      console.error(
        `[${service.name.toUpperCase()}] Docs proxy error:`,
        err.message
      );
      if (!res.headersSent) {
        res.status(502).json({
          error: "Documentation Unavailable",
          message: `Unable to reach ${service.name} documentation`,
          service: service.name,
        });
      }
    },
  });

  app.use(`/api/docs/${service.name}`, docsProxy);
});

// Route pour lister tous les services disponibles
app.get("/api/v1/services", (req, res) => {
  const servicesList = services.map((service) => ({
    name: service.name,
    apiPath: service.apiPath,
    docsPath: `/api/docs/${service.name}`,
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
      docs: "/api/docs",
    },
    services: services.map((s) => s.apiPath),
  });
});

// Documentation Swagger globale
app.get("/api/docs", (req, res) => {
  const docsLinks = services.map((service) => ({
    service: service.name,
    docs: `${req.protocol}://${req.get("host")}/api/docs/${service.name}`,
  }));

  res.json({
    message: "API Documentation",
    services: docsLinks,
  });
});

// Gestion des requêtes OPTIONS pour CORS
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-api-key"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error("Gateway error:", err);

  // Ajout des headers CORS même en cas d'erreur
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.header("Access-Control-Allow-Credentials", "true");

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
    timestamp: new Date().toISOString(),
  });
});

// Gestion gracieuse de l'arrêt
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  setTimeout(() => {
    console.log("Gateway shutdown complete");
    process.exit(0);
  }, 5000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Démarrage du serveur
const startServer = () => {
  app.listen(PORT, async () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(
      `🏥 Health check available at: http://localhost:${PORT}/health`
    );
    console.log(`📚 API docs available at: http://localhost:${PORT}/api/docs`);
    console.log(
      `📋 Services list available at: http://localhost:${PORT}/api/v1/services`
    );

    // Ping initial des services
    console.log("\n🔍 Checking services health...");
    const checks = await Promise.all(services.map(pingService));
    checks.forEach((check) => {
      const status = check.status === "up" ? "✅ UP" : "❌ DOWN";
      console.log(
        `${status} ${check.name}: ${check.status} (${check.responseTime}ms)`
      );
    });
    console.log("\n⚡ Ready to proxy requests!\n");
  });
};

startServer();

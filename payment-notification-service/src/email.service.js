const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs").promises; // Use promises version for better async handling

// Create transporter with better error handling
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add some additional options for better reliability
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    });
  } catch (error) {
    console.error("Error creating email transporter:", error);
    throw error;
  }
};

const transporter = createTransporter();

const sendEmail = async (to, subject, templateName, context = {}) => {
  try {
    // Validate required parameters
    if (!to || !subject || !templateName) {
      throw new Error(
        "Missing required parameters: to, subject, or templateName"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error(`Invalid email format: ${to}`);
    }

    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      `${templateName}.html`
    );

    // Check if template file exists
    try {
      await fs.access(templatePath);
    } catch (error) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    // Read template file asynchronously
    let htmlContent = await fs.readFile(templatePath, "utf8");

    // Replace placeholders in template with better error handling
    for (const key in context) {
      if (context.hasOwnProperty(key)) {
        const value =
          context[key] !== undefined && context[key] !== null
            ? context[key]
            : "";
        htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, "g"), value);
      }
    }

    // Check for unreplaced placeholders and warn
    const unreplacedPlaceholders = htmlContent.match(/{{[^}]+}}/g);
    if (unreplacedPlaceholders) {
      console.warn(
        `Warning: Unreplaced placeholders found: ${unreplacedPlaceholders.join(
          ", "
        )}`
      );
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    // Send email with retry logic
    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to} with subject: ${subject}`);
    console.log(`Message ID: ${result.messageId}`);

    return result;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message || error);
    throw error; // Re-throw to allow caller to handle
  }
};

// Optional: Test email connection
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email server connection is ready");
    return true;
  } catch (error) {
    console.error("Email server connection failed:", error.message || error);
    return false;
  }
};

// Optional: Send plain text email
const sendPlainTextEmail = async (to, subject, text) => {
  try {
    if (!to || !subject || !text) {
      throw new Error("Missing required parameters: to, subject, or text");
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Plain text email sent successfully to ${to}`);
    return result;
  } catch (error) {
    console.error(
      `Error sending plain text email to ${to}:`,
      error.message || error
    );
    throw error;
  }
};

module.exports = {
  sendEmail,
  testConnection,
  sendPlainTextEmail,
};

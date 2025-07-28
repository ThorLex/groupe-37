const fs = require('fs');
const path = require('path');

const templatesDir = 'C:\Users\Dell\Desktop\New folder\groupe-37\payment-notification-service\templates';

if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
  console.log(`Directory created: ${templatesDir}`);
} else {
  console.log(`Directory already exists: ${templatesDir}`);
}
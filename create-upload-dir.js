const fs = require("fs");
const path = require("path");
const uploadDir =
  "C:\\Users\\Dell\\Desktop\\New folder\\groupe-37\\file-service\\uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Directory created: ${uploadDir}`);
} else {
  console.log(`Directory already exists: ${uploadDir}`);
}

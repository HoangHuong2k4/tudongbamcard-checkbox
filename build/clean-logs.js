const fs = require("fs");
const path = require("path");

// More careful console.log removal that preserves syntax
function removeConsoleLogs(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const originalLength = content.length;

  // Remove console.log/warn/info lines more carefully
  const lines = content.split("\n");
  const cleanedLines = lines.filter((line) => {
    const trimmed = line.trim();
    // Keep the line if it's NOT a console.log/warn/info statement
    return !(
      trimmed.startsWith("console.log(") ||
      trimmed.startsWith("console.warn(") ||
      trimmed.startsWith("console.info(") ||
      (trimmed.includes("console.log(") && !trimmed.includes("console.error("))
    );
  });

  content = cleanedLines.join("\n");

  if (content.length !== originalLength) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Cleaned: ${path.basename(filePath)}`);
    return true;
  }
  return false;
}

// Files to clean
const filesToClean = [
  "src/background.js",
  "src/content.js",
  "src/config.js",
  "src/utils/luhn-algorithm.js",
  "src/utils/element-picker.js",
  "ui/settings.js",
  "captcha-solvers/simple-captcha-solver.js",
];

console.log("🧹 Removing console.log statements (v2)...\n");

let cleanedCount = 0;
filesToClean.forEach((file) => {
  const filePath = path.join(__dirname, "..", file);
  if (fs.existsSync(filePath)) {
    if (removeConsoleLogs(filePath)) {
      cleanedCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log(`\n✨ Cleaned ${cleanedCount} files!`);

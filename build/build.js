const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

console.log("🚀 Building production extension...\n");

// Output directory
const outputDir = "dist";
const rootDir = path.join(__dirname, "..");

// Create dist directory structure
const dirsToCreate = [
  outputDir,
  `${outputDir}/src`,
  `${outputDir}/src/utils`,
  `${outputDir}/ui`,
  `${outputDir}/assets`,
  `${outputDir}/assets/icons`,
  `${outputDir}/captcha-solvers`,
  `${outputDir}/captcha-solvers/hcaptcha-solver`,
  `${outputDir}/captcha-solvers/hcaptcha-solver/deepbypasser`,
  `${outputDir}/captcha-solvers/hcaptcha-solver/v2-luxury`,
  `${outputDir}/captcha-solvers/hcaptcha-solver/models`,
  `${outputDir}/docs`,
];

dirsToCreate.forEach((dir) => {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Obfuscation options
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,
  disableConsoleOutput: true, // Remove all console output
  identifierNamesGenerator: "hexadecimal",
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ["base64"],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
};

// Files to obfuscate
const filesToObfuscate = [
  { src: "src/background.js", dest: "src/background.js" },
  { src: "src/content.js", dest: "src/content.js" },
  { src: "src/utils/luhn-algorithm.js", dest: "src/utils/luhn-algorithm.js" },
  { src: "src/utils/element-picker.js", dest: "src/utils/element-picker.js" },
  { src: "ui/settings.js", dest: "ui/settings.js" },
  {
    src: "captcha-solvers/simple-captcha-solver.js",
    dest: "captcha-solvers/simple-captcha-solver.js",
  },
];

console.log("🔒 Obfuscating JavaScript files...\n");

filesToObfuscate.forEach(({ src, dest }) => {
  const inputPath = path.join(rootDir, src);
  const outputPath = path.join(rootDir, outputDir, dest);

  if (fs.existsSync(inputPath)) {
    console.log(`Processing: ${src}`);
    const code = fs.readFileSync(inputPath, "utf8");
    const obfuscationResult = JavaScriptObfuscator.obfuscate(
      code,
      obfuscationOptions,
    );
    fs.writeFileSync(outputPath, obfuscationResult.getObfuscatedCode());
    console.log(`✅ Obfuscated: ${src}`);
  } else {
    console.log(`⚠️  Not found: ${src}`);
  }
});

// Files to copy without obfuscation
const filesToCopy = [
  { src: "src/config.js", dest: "src/config.js" },
  { src: "ui/settings.html", dest: "ui/settings.html" },
  { src: "ui/custom.css", dest: "ui/custom.css" },
  { src: "manifest.json", dest: "manifest.json" },
  { src: "assets/icons/icon16.png", dest: "assets/icons/icon16.png" },
  { src: "assets/icons/icon32.png", dest: "assets/icons/icon32.png" },
  { src: "assets/icons/icon48.png", dest: "assets/icons/icon48.png" },
  { src: "assets/icons/icon128.png", dest: "assets/icons/icon128.png" },
  { src: "docs/README.md", dest: "docs/README.md" },
  { src: "docs/CUSTOMER_GUIDE.md", dest: "docs/CUSTOMER_GUIDE.md" },
];

console.log("\n📋 Copying files...\n");

filesToCopy.forEach(({ src, dest }) => {
  const inputPath = path.join(rootDir, src);
  const outputPath = path.join(rootDir, outputDir, dest);

  if (fs.existsSync(inputPath)) {
    fs.copyFileSync(inputPath, outputPath);
    console.log(`✅ Copied: ${src}`);
  } else {
    console.log(`⚠️  Not found: ${src}`);
  }
});

// Copy captcha solver folders (already minified)
console.log("\n📦 Copying captcha solvers...\n");

const captchaDirs = [
  "captcha-solvers/hcaptcha-solver/deepbypasser",
  "captcha-solvers/hcaptcha-solver/v2-luxury",
  "captcha-solvers/hcaptcha-solver/models",
];

function copyDir(src, dest) {
  const srcPath = path.join(rootDir, src);
  const destPath = path.join(rootDir, outputDir, dest);

  if (fs.existsSync(srcPath)) {
    const files = fs.readdirSync(srcPath);
    files.forEach((file) => {
      const srcFile = path.join(srcPath, file);
      const destFile = path.join(destPath, file);

      if (fs.statSync(srcFile).isDirectory()) {
        if (!fs.existsSync(destFile)) {
          fs.mkdirSync(destFile, { recursive: true });
        }
        copyDir(path.join(src, file), path.join(dest, file));
      } else {
        fs.copyFileSync(srcFile, destFile);
      }
    });
    console.log(`✅ Copied directory: ${src}`);
  }
}

captchaDirs.forEach((dir) => {
  copyDir(dir, dir);
});

console.log("\n✨ Build complete!");
console.log(`📦 Production files are in the "${outputDir}" directory`);
console.log("\n📝 Files customers can edit:");
console.log("   - src/config.js (countries and addresses)");
console.log("   - ui/settings.html (UI customization)");
console.log("   - ui/custom.css (styling)");

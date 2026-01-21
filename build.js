const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Files to obfuscate
const filesToObfuscate = [
  'background.js',
  'content.js',
  'settings.js'
];

// Output directory
const outputDir = 'dist';

// Create dist directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Obfuscation options
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

console.log('🔒 Starting JavaScript obfuscation...\n');

// Obfuscate each file
filesToObfuscate.forEach(file => {
  const inputPath = path.join(__dirname, file);
  const outputPath = path.join(__dirname, outputDir, file);
  
  console.log(`Processing: ${file}`);
  
  const code = fs.readFileSync(inputPath, 'utf8');
  const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
  
  fs.writeFileSync(outputPath, obfuscationResult.getObfuscatedCode());
  console.log(`✅ Obfuscated: ${file} -> dist/${file}`);
});

// Copy files that should NOT be obfuscated
const filesToCopy = [
  'config.js',
  'settings.html',
  'custom.css',
  'manifest.json',
  'README.md',
  'icon16.png',
  'icon32.png',
  'icon48.png',
  'icon128.png'
];

console.log('\n📋 Copying non-obfuscated files...\n');

filesToCopy.forEach(file => {
  const inputPath = path.join(__dirname, file);
  const outputPath = path.join(__dirname, outputDir, file);
  
  fs.copyFileSync(inputPath, outputPath);
  console.log(`✅ Copied: ${file}`);
});

console.log('\n✨ Build complete! Production files are in the "dist" directory.');
console.log('📦 Files that customers can edit:');
console.log('   - config.js (add new countries and addresses)');
console.log('   - settings.html (add new country options)');

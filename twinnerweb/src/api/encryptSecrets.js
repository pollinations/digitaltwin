import fs from 'fs';
import path from 'path';
import CryptoJS from 'crypto-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Check if password is provided
if (process.argv.length < 3) {
    console.error('Please provide an encryption password as a command-line argument.');
    process.exit(1);
}

const password = process.argv[2];

// Load .env file manually
const envFilePath = path.resolve(process.cwd(), '.env');
const envFileContent = fs.readFileSync(envFilePath, 'utf8');

// Parse .env file content
const secrets = {};
envFileContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        secrets[key] = value.trim();
    }
});

// Convert secrets object to JSON string
const secretsString = JSON.stringify(secrets);

// Encrypt the secrets
const encryptedData = CryptoJS.AES.encrypt(secretsString, password).toString();

// Create the output content
const outputContent = `// This file contains encrypted secrets. Do not modify manually.
export const encryptedSecrets = "${encryptedData}";
`;

// Ensure the directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputDir = path.join(__dirname);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write to file
const outputPath = path.join(outputDir, 'encryptedSecrets.js');
fs.writeFileSync(outputPath, outputContent);

console.log(`Encrypted secrets have been saved to ${outputPath}`);
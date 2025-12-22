// Azure Blob Storage Configuration
// Reads from environment variables (assumed to be set in .env)

// Try to load .env file if dotenv is available
try {
    const path = require('path');
    const fs = require('fs');
    const envPath = path.join(__dirname, '..', '.env');
    
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf-8');
      envFile.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            // Remove quotes if present
            const cleanValue = value.replace(/^["']|["']$/g, '');
            if (!process.env[key.trim()]) {
              process.env[key.trim()] = cleanValue;
            }
          }
        }
      });
    }
  } catch (error) {
    console.warn('Could not load .env file:', error.message);
  }
  
  module.exports = {
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || '',
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY || '',
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'cost-scenarios',
    containerNameCalc: process.env.AZURE_STORAGE_CONTAINER_NAME_CALC || process.env.AZURE_STORAGE_CONTAINER_NAME || 'cost-scenarios',
  };
  
  
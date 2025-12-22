import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { createRequire } from 'module';

const getBackendRoot = () => {
  const currentDir = __dirname;
  
  if (currentDir.includes(path.join('dist', 'apps', 'backend'))) {
    const distBackendPath = path.resolve(currentDir, '../../../');
    const distIndex = distBackendPath.indexOf(path.sep + 'dist' + path.sep);
    if (distIndex !== -1) {
      return distBackendPath.substring(0, distIndex);
    }
  }
  
  return path.resolve(currentDir, '../../');
};

const backendRoot = getBackendRoot();
const azureBlobStoragePath = path.join(backendRoot, 'AzureBlobStorage.ts');
const configPath = path.join(backendRoot, 'config', 'azureBlob.ts');

const backendRequire = createRequire(azureBlobStoragePath);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = backendRequire(configPath);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AzureBlobStorage = backendRequire(azureBlobStoragePath);

@Injectable()
export class AzureBlobService {
  private readonly logger = new Logger(AzureBlobService.name);

  /**
   * Upload cost aggregation scenario JSON file using AzureBlobStorage.ts
   */
  async uploadCostAggregationScenario(
    jsonData: string,
    filename?: string
  ): Promise<{ success: boolean; url: string; requestId?: string }> {
    if (!config.accountName || config.accountName.trim() === '') {
      this.logger.error('AZURE_STORAGE_ACCOUNT_NAME is not set or empty');
      throw new Error('Azure Storage Account Name is not configured. Please set AZURE_STORAGE_ACCOUNT_NAME in .env file');
    }
    
    if (!config.accountKey || config.accountKey.trim() === '') {
      this.logger.error('AZURE_STORAGE_ACCOUNT_KEY is not set or empty');
      throw new Error('Azure Storage Account Key is not configured. Please set AZURE_STORAGE_ACCOUNT_KEY in .env file');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const finalFilename = filename || `cost-aggregation-scenario-${timestamp}.json`;
    const directoryPath = process.env.AZURE_STORAGE_SCENARIO_PATH || 'cost-aggregation-scenarios';
    const data = Buffer.from(jsonData, 'utf-8');

    this.logger.log(`Uploading to Azure Blob Storage: ${config.containerName}/${directoryPath}/${finalFilename}`);

    try {
      const result = await AzureBlobStorage.uploadBlob(directoryPath, finalFilename, data);

      if (!result || !result.url) {
        const accountName = config.accountName;
        const containerName = config.containerName || 'cost-scenarios';
        const fallbackUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${directoryPath}/${finalFilename}`;
        this.logger.warn(`uploadBlob did not return URL, using fallback: ${fallbackUrl}`);
        return { success: true, url: fallbackUrl };
      }

      this.logger.log(`Successfully uploaded to: ${result.url}`);
      return { success: true, url: result.url, requestId: result.requestId };
    } catch (error) {
      this.logger.error(`Failed to upload to Azure Blob Storage: ${error.message}`, error.stack);
      throw new Error(`Failed to upload to Azure Blob Storage: ${error.message}`);
    }
  }
}

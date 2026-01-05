import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { createRequire } from 'module';

// 本番環境（dist）ではTypeScriptが既に.jsにコンパイルされているため、.jsファイルをrequireする必要がある
// 開発環境では.tsファイルを直接requireできる（ts-node使用時）ため、.tsを優先的に探す
const isProduction = __dirname.includes(path.join('dist', 'apps', 'backend'));

// ファイルパス解決：本番は.js、開発は.tsを優先
const resolveFilePath = (basePath: string, fileName: string): string => {
  if (isProduction) {
    // 本番環境：コンパイル済みの.jsファイルを使用
    return path.join(basePath, `${fileName}.js`);
  } else {
    // 開発環境：.tsファイルがあれば使用、なければ.js
    const tsPath = path.join(basePath, `${fileName}.ts`);
    const jsPath = path.join(basePath, `${fileName}.js`);
    if (fs.existsSync(tsPath)) {
      return tsPath;
    }
    return jsPath;
  }
};

const azureBlobStoragePath = resolveFilePath(__dirname, 'AzureBlobStorage');
const backendRequire = createRequire(__filename);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AzureBlobStorage = backendRequire(azureBlobStoragePath);

@Injectable()
export class AzureBlobService {
  private readonly logger = new Logger(AzureBlobService.name);
  private readonly azureBlobStorage: InstanceType<typeof AzureBlobStorage>;

  constructor(private readonly configService: ConfigService) {
    const accountName = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_NAME') || '';
    const accountKey = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_KEY') || '';
    const containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME') || 'cost-scenarios';
    const containerNameCalc = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME_CALC') || containerName;

    this.azureBlobStorage = new AzureBlobStorage({
      accountName,
      accountKey,
      containerName,
      containerNameCalc,
    });
  }

  /**
   * 集計シナリオJSONファイルをAzure Blob Storageにアップロード
   */
  async uploadCostAggregationScenario(
    jsonData: string,
    filename?: string
  ): Promise<{ success: boolean; url: string; requestId?: string }> {
    const accountName = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_NAME') || '';
    const containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME') || 'cost-scenarios';

    if (!accountName || accountName.trim() === '') {
      this.logger.error('AZURE_STORAGE_ACCOUNT_NAME is not set or empty');
      throw new Error('Azure Storage Account Name is not configured. Please set AZURE_STORAGE_ACCOUNT_NAME in .env file');
    }

    const accountKey = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_KEY') || '';
    if (!accountKey || accountKey.trim() === '') {
      this.logger.error('AZURE_STORAGE_ACCOUNT_KEY is not set or empty');
      throw new Error('Azure Storage Account Key is not configured. Please set AZURE_STORAGE_ACCOUNT_KEY in .env file');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const finalFilename = filename || `cost-aggregation-scenario-${timestamp}.json`;
    const directoryPath = this.configService.get<string>('AZURE_STORAGE_SCENARIO_PATH') || 'cost-aggregation-scenarios';
    const data = Buffer.from(jsonData, 'utf-8');

    this.logger.log(`Uploading to Azure Blob Storage: ${containerName}/${directoryPath}/${finalFilename}`);

    try {
      await this.azureBlobStorage.uploadBlob(directoryPath, finalFilename, data);

      const fallbackUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${directoryPath}/${finalFilename}`;
      this.logger.log(`Successfully uploaded to: ${fallbackUrl}`);
      return { success: true, url: fallbackUrl };
    } catch (error) {
      this.logger.error(`Failed to upload to Azure Blob Storage: ${error.message}`, error.stack);
      throw new Error(`Failed to upload to Azure Blob Storage: ${error.message}`);
    }
  }
}

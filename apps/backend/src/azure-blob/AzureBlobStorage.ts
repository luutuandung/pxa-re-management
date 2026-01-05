// @ts-nocheck - CommonJS file, no type checking needed
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require('@azure/storage-blob');

const { DataLakeServiceClient } = require('@azure/storage-file-datalake');

const { stringify } = require('csv-stringify/sync');

// 日付ユーティリティ関数
const getCurrentTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

class AzureBlobStorage {
  static UPLOAD_CALC_FILE_PATH =
    'px01/DEVELOPMENT_MATERIAL/DEV_BOM_CALC/ResultFile';

  /** @type {string} */
  accountName;
  /** @type {string} */
  accountKey;
  /** @type {string} */
  containerName;
  /** @type {string} */
  containerNameCalc;
  /** @type {BlobServiceClient} */
  blobServiceClient;
  /** @type {DataLakeServiceClient} */
  dlServiceClient;

  /**
   * @param {Object} config
   * @param {string} config.accountName
   * @param {string} config.accountKey
   * @param {string} [config.containerName]
   * @param {string} [config.containerNameCalc]
   */
  constructor(config) {
    this.accountName = config.accountName;
    this.accountKey = config.accountKey;
    this.containerName = config.containerName || 'cost-scenarios';
    this.containerNameCalc =
      config.containerNameCalc || config.containerName || 'cost-scenarios';

    const sharedKeyCredential = new StorageSharedKeyCredential(
      this.accountName,
      this.accountKey,
    );

    this.blobServiceClient = new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net`,
      sharedKeyCredential,
    );

    this.dlServiceClient = new DataLakeServiceClient(
      `https://${this.accountName}.dfs.core.windows.net`,
      sharedKeyCredential,
    );
  }

  /**
   * ファイルをアップロードする
   * @param {*} directoryPath ディレクトリパス
   * @param {*} blobName      ファイル名
   * @param {*} data          ファイルデータ
   */
  async uploadBlob(directoryPath, blobName, data) {
    const fullBlobName = `${directoryPath}/${blobName}`; // ディレクトリパスを含めたBlob名
    try {
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName,
      );
      const blobClient = containerClient.getBlockBlobClient(fullBlobName);

      await blobClient.upload(data, data.length);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 集計CSV作成用JSONファイルをアップロードする
   * @param {*} directoryPath ディレクトリパス
   * @param {*} blobName      ファイル名
   * @param {*} json          ファイルデータ
   */
  async uploadCalcJson(json) {
    const fullBlobName = `${AzureBlobStorage.UPLOAD_CALC_FILE_PATH
      }/CalcDevBom_${getCurrentTimestamp()}.json`; // ディレクトリパスを含めたBlob名
    try {
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerNameCalc,
      );
      const blobClient = containerClient.getBlockBlobClient(fullBlobName);

      await blobClient.upload(json, json.length);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 集計CSVアップロード
   * @param {*} data              集計結果データ
   * @param {*} deleteType        削除タイプ（削除しない：空文字、STEP削除："step"、機種削除："model"）
   * @param {*} businessUnitName  事業部名
   * @param {*} seriesName        シリーズ
   * @param {*} modelName         機種名
   * @param {*} stepName          STEP名
   * @param {*} stepId            STEID
   * @param {*} baseModelCost     基準材料費データ
   */
  async uploadDevBomCalc(
    data,
    deleteType,
    businessUnitName,
    seriesName,
    modelName,
    stepName,
    stepId,
    baseModelCost,
  ) {
    const modelFolderPath = `${AzureBlobStorage.UPLOAD_CALC_FILE_PATH}/${businessUnitName}/${seriesName}/${modelName}`;
    try {
      const fileSystemClient = this.dlServiceClient.getFileSystemClient(
        this.containerNameCalc,
      );

      const csvOption = {
        header: true,
        quoted: true,
        cast: {
          date: (value) => {
            const yyyy = value.getFullYear();
            const mm = String(value.getMonth() + 1).padStart(2, '0');
            const dd = String(value.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
          },
        },
      };

      // deleteTypeが「model」の場合
      if (deleteType === 'model') {
        // 機種フォルダを削除
        const fileClient = fileSystemClient.getFileClient(modelFolderPath);
        await fileClient.deleteIfExists(true);
      } else {
        const historyFolderPath = `${modelFolderPath}/履歴`;
        const directoryClient =
          fileSystemClient.getDirectoryClient(historyFolderPath);
        const exists = await directoryClient.exists();
        if (!exists) {
          await directoryClient.create();
        }

        const stepFilePath = `${modelFolderPath}/${stepName}.csv`;
        const stepFileClient = fileSystemClient.getFileClient(stepFilePath);

        if (await stepFileClient.exists()) {
          // STEPファイルが存在する場合は履歴フォルダへ移動する
          const lastModified = (await stepFileClient.getProperties())
            .lastModified;
          const timestamp = lastModified
            .toISOString()
            .replace(/[-:.TZ]/g, '')
            .slice(0, 14);
          const historyFilePath = `${historyFolderPath}/${stepName}_${timestamp}.csv`;
          await stepFileClient.move(historyFilePath);
        }

        if (deleteType !== 'step') {
          // 対象STEPのものだけ抜き出したCSVをアップロード
          const filteredData = data.filter((row) => row.STEPID === stepId);
          const newStepFileClient =
            fileSystemClient.getFileClient(stepFilePath);
          const csv = stringify(filteredData, csvOption);
          await newStepFileClient.create();
          if (csv.length > 0) {
            await newStepFileClient.append(
              Buffer.from(csv),
              0,
              Buffer.byteLength(csv),
            );
            await newStepFileClient.flush(Buffer.byteLength(csv));
          }
        }

        // 機種全体の集計CSVをアップロード
        const allFilePath = `${modelFolderPath}/All.csv`;
        const allFileClient = fileSystemClient.getFileClient(allFilePath);

        if (await allFileClient.exists()) {
          // STEPファイルが存在する場合は履歴フォルダへ移動する
          const lastModified = (await allFileClient.getProperties())
            .lastModified;
          const timestamp = lastModified
            .toISOString()
            .replace(/[-:.TZ]/g, '')
            .slice(0, 14);
          const historyFilePath = `${historyFolderPath}/All_${timestamp}.csv`;
          await allFileClient.move(historyFilePath);
        }

        const newAllFileClient = fileSystemClient.getFileClient(allFilePath);
        const csv = stringify(data, csvOption);
        await newAllFileClient.create();
        if (csv.length > 0) {
          await newAllFileClient.append(
            Buffer.from(csv),
            0,
            Buffer.byteLength(csv),
          );
          await newAllFileClient.flush(Buffer.byteLength(csv));
        }

        if (baseModelCost) {
          // 基準材料費データがある場合は基準材料費データCSVをアップロード
          const baseModelCostFilePath = `${modelFolderPath}/BaseModelCost.csv`;
          const baseModelCostFilePathFileClient =
            fileSystemClient.getFileClient(baseModelCostFilePath);
          const baseModelCostCsv = stringify(baseModelCost, csvOption);
          await baseModelCostFilePathFileClient.create();
          if (baseModelCostCsv.length > 0) {
            await baseModelCostFilePathFileClient.append(
              Buffer.from(baseModelCostCsv),
              0,
              Buffer.byteLength(baseModelCostCsv),
            );
            await baseModelCostFilePathFileClient.flush(
              Buffer.byteLength(baseModelCostCsv),
            );
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AzureBlobStorage;

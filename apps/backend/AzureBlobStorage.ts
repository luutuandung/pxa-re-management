const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    BlobSASPermissions,
    generateBlobSASQueryParameters,
  } = require("@azure/storage-blob");
  
  const {
    DataLakeServiceClient, 
  } = require("@azure/storage-file-datalake");
  
  const { stringify } = require("csv-stringify/sync");
  
  const path = require("path");
  
  // Resolve paths relative to this file's location
  const configPath = path.join(__dirname, "config", "azureBlob.ts");
  const loggerPath = path.join(__dirname, "utils", "logger.ts");
  
  const {
    accountName,
    accountKey,
    containerName,
    containerNameCalc,
  } = require(configPath);
  
  const logger = require(loggerPath);
  
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );
  
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );
  
  const dlServiceClient = new DataLakeServiceClient(
    `https://${accountName}.dfs.core.windows.net`,
    sharedKeyCredential
  );
  
  // Date utility function
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
  
    static UPLOAD_CALC_FILE_PATH = 'px01/DEVELOPMENT_MATERIAL/DEV_BOM_CALC/ResultFile';
  
    /**
     * ファイルをアップロードする
     * @param {*} directoryPath ディレクトリパス
     * @param {*} blobName      ファイル名
     * @param {*} data          ファイルデータ
     */
    static async uploadBlob(directoryPath, blobName, data) {
      const fullBlobName = `${directoryPath}/${blobName}`; // ディレクトリパスを含めたBlob名
      try {
        const containerClient =
          blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlockBlobClient(fullBlobName);
  
        logger.info(
          `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blobClient.url}`
        );
  
        const uploadBlobResponse = await blobClient.upload(data, data.length);
        logger.info(
          `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );
      } catch (error) {
        logger.error({ message: error.message, stack: error.stack });
        throw error;
      }
    }
  
    /**
     * 集計CSV作成用JSONファイルをアップロードする
     * @param {*} directoryPath ディレクトリパス
     * @param {*} blobName      ファイル名
     * @param {*} json          ファイルデータ
     */
    static async uploadCalcJson(json) {
      const fullBlobName = `${AzureBlobStorage.UPLOAD_CALC_FILE_PATH}/CalcDevBom_${getCurrentTimestamp()}.json`; // ディレクトリパスを含めたBlob名
      try {
        const containerClient =
          blobServiceClient.getContainerClient(containerNameCalc);
        const blobClient = containerClient.getBlockBlobClient(fullBlobName);
  
        logger.info(
          `\nUploading to Azure storage as calc json\n\tname: ${fullBlobName}:\n\tURL: ${blobClient.url}`
        );
  
        const uploadBlobResponse = await blobClient.upload(json, json.length);
        logger.info(
          `Calc json was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        );
      } catch (error) {
        logger.error({ message: error.message, stack: error.stack });
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
    static async uploadDevBomCalc(data, deleteType, businessUnitName, seriesName, modelName, stepName, stepId, baseModelCost) {
      logger.info(`uploadDevBomCalc start.`);        
  
      const modelFolderPath = `${AzureBlobStorage.UPLOAD_CALC_FILE_PATH}/${businessUnitName}/${seriesName}/${modelName}`;
      try {
        const fileSystemClient = dlServiceClient.getFileSystemClient(containerNameCalc);
  
        const csvOption = { 
          header: true, 
          quoted: true,        
          cast: {
            date: (value) => {
              const yyyy = value.getFullYear();
              const mm = String(value.getMonth() + 1).padStart(2, '0');
              const dd = String(value.getDate()).padStart(2, '0');
              return `${yyyy}-${mm}-${dd}`;
            }
          }
        }
  
        // deleteTypeが「model」の場合
        if(deleteType === "model") {
          // 機種フォルダを削除
          const fileClient = fileSystemClient.getFileClient(modelFolderPath);
          const response = await fileClient.deleteIfExists(true);
          logger.info(`Delete model folder. requestId: ${response.requestId}`);        
        }
        else {
          const historyFolderPath = `${modelFolderPath}/履歴`
          const directoryClient = fileSystemClient.getDirectoryClient(historyFolderPath);
          const exists = await directoryClient.exists();
          if(!exists) {
            const response = await directoryClient.create();
            logger.info(`Create history folder. requestId: ${response.requestId}`);        
          }
  
          const stepFilePath = `${modelFolderPath}/${stepName}.csv`; 
          const stepFileClient = fileSystemClient.getFileClient(stepFilePath);
  
          if (await stepFileClient.exists()) {
            // STEPファイルが存在する場合は履歴フォルダへ移動する
            const lastModified = (await stepFileClient.getProperties()).lastModified;
            const timestamp = lastModified.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
            const historyFilePath = `${historyFolderPath}/${stepName}_${timestamp}.csv`; 
            const response = await stepFileClient.move(historyFilePath);
            logger.info(`Move step for history folder. requestId: ${response.requestId}`);        
          }
  
          if(deleteType !== "step") {
            // 対象STEPのものだけ抜き出したCSVをアップロード
            const filteredData = data.filter(row => row.STEPID === stepId);
            const newStepFileClient = fileSystemClient.getFileClient(stepFilePath);
            const csv = stringify(filteredData, csvOption);
            const response = await newStepFileClient.create();
            if(csv.length > 0) {
              await newStepFileClient.append(Buffer.from(csv), 0, Buffer.byteLength(csv));
              await newStepFileClient.flush(Buffer.byteLength(csv));
            }
            logger.info(`Create step file. requestId: ${response.requestId}`);        
          }
  
          // 機種全体の集計CSVをアップロード
          const allFilePath = `${modelFolderPath}/All.csv`; 
          const allFileClient = fileSystemClient.getFileClient(allFilePath);
  
          if (await allFileClient.exists()) {
            // STEPファイルが存在する場合は履歴フォルダへ移動する
            const lastModified = (await allFileClient.getProperties()).lastModified;
            const timestamp = lastModified.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
            const historyFilePath = `${historyFolderPath}/All_${timestamp}.csv`; 
            const response = await allFileClient.move(historyFilePath);
            logger.info(`Move all for history folder. requestId: ${response.requestId}`);        
          }
  
          const newAllFileClient = fileSystemClient.getFileClient(allFilePath);
          const csv = stringify(data, csvOption);
          const response = await newAllFileClient.create();
          if(csv.length > 0) {
            await newAllFileClient.append(Buffer.from(csv), 0, Buffer.byteLength(csv));
            await newAllFileClient.flush(Buffer.byteLength(csv));
          }
          logger.info(`Create all file. requestId: ${response.requestId}`);        
  
          if(baseModelCost) {
            // 基準材料費データがある場合は基準材料費データCSVをアップロード
            const baseModelCostFilePath = `${modelFolderPath}/BaseModelCost.csv`; 
            const baseModelCostFilePathFileClient = fileSystemClient.getFileClient(baseModelCostFilePath);
            const baseModelCostCsv = stringify(baseModelCost, csvOption);
            const baseModelCostResponse = await baseModelCostFilePathFileClient.create();
            if(baseModelCostCsv.length > 0) {
              await baseModelCostFilePathFileClient.append(Buffer.from(baseModelCostCsv), 0, Buffer.byteLength(baseModelCostCsv));
              await baseModelCostFilePathFileClient.flush(Buffer.byteLength(baseModelCostCsv));
            }
            logger.info(`Create baseModelCost file. requestId: ${baseModelCostResponse.requestId}`);        
          }
        }
      } catch (error) {
        logger.error({ message: error.message, stack: error.stack });
      }
    }
  }
  
  module.exports = AzureBlobStorage;
  
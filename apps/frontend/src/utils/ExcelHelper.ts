import * as XLSX from 'xlsx';


abstract class ExcelHelper {

  public static async parseFile<Item extends { [key: string]: unknown; }>(
    {
      targetFile,
      buildItem,
      mustSkipFirstRow = false
    }: Readonly<{
      targetFile: File;
      buildItem: (cellsContent: ReadonlyArray<unknown>) => Item;
      mustSkipFirstRow?: boolean;
    }>
  ): Promise<Array<Item>> {
    return new Promise<Array<Item>>((resolve: (items: Array<Item>) => void, reject: (error: Error) => void): void => {

      const fileReader: FileReader = new FileReader();

      fileReader.onload = (
        (event: ProgressEvent<FileReader>): void => {

          const rawData: ArrayBuffer | string | null | undefined = event.target?.result;

          if (!(rawData instanceof ArrayBuffer)) {
            reject(new ExcelHelper.Errors.RawDataIsNotAsArrayBufferError());
            return;
          }


          const arrayedData: Uint8Array = new Uint8Array(rawData);

          const workbook: XLSX.WorkBook = XLSX.read(arrayedData, { type: 'array' });

          const sheetName: string | undefined = workbook.SheetNames[0];

          if (typeof sheetName === "undefined") {
            reject(new ExcelHelper.Errors.NoFirstSheetFoundError());
            return;
          }


          const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
          let JSON_Data: ReadonlyArray<unknown>;

          try {

            /* 【 理論 ：xlsx 】
             * headerが指定されたら（具体的な文字列や数が不問らしい）、一行目は飛ばされる。
             * https://www.npmjs.com/package/xlsx#json */
            JSON_Data = XLSX.utils.sheet_to_json(worksheet, { ...mustSkipFirstRow ? { header: 1 } : null });

          } catch (error: unknown) {
            reject(new ExcelHelper.Errors.ConvertingToJSON_FailedError(error));
            return;
          }



          resolve(
            (mustSkipFirstRow ? JSON_Data.slice(1) : JSON_Data).
              filter<Array<unknown>>(
                (rowContent: unknown, rowIndex: number): rowContent is Array<unknown> => {

                  if (!Array.isArray(rowContent)) {
                    throw new ExcelHelper.Errors.WorksheetContentInForArrayError({
                      rowNumber__numerationFrom1: rowIndex + (mustSkipFirstRow ? 2 : 1),
                      rowContent
                    });
                  }


                  /* 【 理論：xlsx 】 空配列はあり得る。 */
                  return rowContent.length > 0;

                }
              ).
              map(buildItem)
          );

        }
      );

      fileReader.onerror = (): void => { reject(new Error("エクセルファイルの処理中予想外のエラーが発生。")); }

      fileReader.readAsArrayBuffer(targetFile);

    });
  }

  public static async writeDataToFile<Item>(
    {
      headerCellsContent,
      bodyCellsContent,
      transformItemToCellsArray,
      outputFileNameWithExtension
    }: Readonly<{
      headerCellsContent: Array<string>;
      bodyCellsContent: ReadonlyArray<Item>;
      transformItemToCellsArray: (item: Item) => Array<string | number | boolean>;
      outputFileNameWithExtension: string;
    }>
  ): Promise<void> {

    const workBook: XLSX.WorkBook = XLSX.utils.book_new();

    const workSheet: XLSX.WorkSheet =  XLSX.utils.aoa_to_sheet([
      headerCellsContent,
      ...[ ...bodyCellsContent.map(transformItemToCellsArray) ]
    ]);

    XLSX.utils.book_append_sheet(workBook, workSheet);

    XLSX.writeFile(workBook, outputFileNameWithExtension);

  }

}


namespace ExcelHelper {

  export namespace Errors {

    export class RawDataIsNotAsArrayBufferError extends Error {
      public readonly name: string = "RawDataIsNotAsArrayBufferError";
      public readonly message: string = "エクセルファイルのコンテンツはArrayBufferになっていない。";
    }

    export class NoFirstSheetFoundError extends Error {
      public readonly name: string = "NoFirstSheetFoundError";
      public readonly message: string = "対象エクセルファイルは一枚目のシートを含めていない。";
    }

    export class ConvertingToJSON_FailedError extends Error {

      public readonly name: string = "ConvertingToJSON_FailedError";

      public constructor(cause: unknown) {
        super("エクセルファイルをJSONへの変換中エラーが発生。", { cause });
      }

    }

    export class WorksheetContentInForArrayError extends Error {
      public readonly name: string = "WorksheetContentInForArrayError";
      public constructor(
        {
          rowNumber__numerationFrom1,
          rowContent
        }: Readonly<{
          rowNumber__numerationFrom1: number;
          rowContent: unknown;
        }>
      ) {
        super(
          `期待に反し、対象エクセルファイルの${ rowNumber__numerationFrom1 }行目のコンテンツは配列になっていなく、${ typeof rowContent }` +
            `になっている。${ String(rowContent) }`
        );
      }
    }

  }

}


export default ExcelHelper;

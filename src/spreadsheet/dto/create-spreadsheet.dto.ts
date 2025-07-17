import {
  ArrayElement,
  spreadSheetColumns,
} from 'src/spreadsheet/utils/parseSpreadSheetToEntity';

export class CreateSpreadsheetDto {
  modelName: string;
  modelSchema?: ModelSchema;
}

export type ModelSchema = Array<{
  sheetColumn: ArrayElement<typeof spreadSheetColumns>;
  entityField: string;
}>;

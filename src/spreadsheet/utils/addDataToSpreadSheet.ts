import * as ExcelJS from 'exceljs';
import { monthName } from './utils';


export const addDataToSpreadSheet = async <T extends object>(
  spreadSheet: Buffer,
  sheetName: string,
  data: T[],
  startRow?: number,
  fileName?: string,
  styleOptions?: {
    alignItemsToCenter?: boolean;
    cellWidth?: number;
  },
): Promise<string> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(spreadSheet);

  const FIRST_WORKSHEET = 1;
  const worksheet = workbook.getWorksheet(FIRST_WORKSHEET);
  const worksheetListULS = workbook.getWorksheet('ULS');
  let targetColumn = null;

  worksheetListULS.getRow(1).eachCell((cell, colNumber) => {
    if (cell.value.toString().toLowerCase() === sheetName.toLowerCase()) {
      targetColumn = colNumber;
    }
  });

  if (targetColumn) {
    // Obter as opções dessa coluna a partir da linha 2 até à última com dados
    const options: string[] = [];
    let colNumber = null;
  
    worksheetListULS.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const cellValue = row.getCell(targetColumn).value;
        if (cellValue) {
          colNumber = rowNumber;
        }
      }
    });
    if (colNumber){
      const uniqueOptions = Array.from(new Set(options));
      const formula = '=ULS!$'+String.fromCharCode(64 + targetColumn)+'$2:$'+String.fromCharCode(64 + targetColumn)+'$'+String(colNumber)+'';
      for (let row = 7; row <= 260; row++) {
        let cell = worksheet.getCell(`F${row}`);  
        cell.dataValidation = undefined;
        //console.log(`Adding data validation to cell F${row} with formula: ${formula}`);
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [formula],
        };
      }
    }
    
  };

  
  //workbook.calcProperties.fullCalcOnLoad = true;
  data.forEach((item, index) => {
    const rowIndex = startRow ? startRow + index : index + 2;

    const row = worksheet.getRow(rowIndex);

    Object.keys(item).forEach((key, keyIndex) => {
      const cell = row.getCell(keyIndex + 1);

      if (styleOptions?.alignItemsToCenter) {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      }

      cell.value = item[key as keyof T] as ExcelJS.CellValue;
    });

    if (styleOptions?.alignItemsToCenter) {
      row.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }
  });
  const match = fileName.match(/(\d{4})_(\d{2})/);
  if (match){
    worksheet.getCell('AB3').value =  monthName(match[2]);
    worksheet.getCell('AI3').value = match[1];
  }
  //ADD FORMULAS PREVISTAS NO NOVO LAYOUT
  worksheet.getCell('N3').value = sheetName;


  worksheet.getCell('AN261').value = { formula: '=SUM(AN6:AN260)', result: 0,  date1904: false };
  worksheet.getCell('AO261').value = { formula: '=SUM(AO6:AO260)', result: 0,  date1904: false };
  worksheet.getCell('AP261').value = { formula: '=SUM(AP6:AP260)', result: 0,  date1904: false };
  worksheet.getCell('AQ261').value = { formula: '=SUM(AQ6:AQ260)', result: 0,  date1904: false };
  worksheet.getCell('AR261').value = { formula: '=SUM(AR6:AR260)', result: 0,  date1904: false };
  worksheet.getCell('AQ261').value = { formula: '=SUM(AS6:AS260)', result: 0,  date1904: false };
  worksheet.getCell('AP263').value = { formula: '=AP261*67.156', result: 0,  date1904: false };



  
  if (styleOptions?.cellWidth) {
    worksheet.columns.forEach((column) => {
      column.width = styleOptions.cellWidth;
    });
  }

  // Copie apenas os valores (não as tabelas)
  for (let row = 7; row <= 260; row++) {
        let cell = worksheet.getCell(`AN${row}`);
        cell.value = null;
        if (cell.model) {
          delete cell.model.formula;
          delete cell.model.sharedFormula;
          delete cell.model.result;
        }
        cell.value = { formula: `=COUNTIF(I${row}:AM${row},"HDF")`, result: 0,  date1904: false };
        console.log(worksheet.getCell(`AN${row}`).value);

        

        cell = worksheet.getCell(`AO${row}`);
        cell.value = null;
          cell.value = { formula: `=COUNTIF(I${row}:AM${row},"AC")`, result: 0,  date1904: false };
        

        cell = worksheet.getCell(`AP${row}`);
         cell.value = null;
           cell.value = { formula: `=COUNTIF(I${row}:AM${row},"A")+COUNTIF(I${row}:AM${row},"AC")+COUNTIF(I${row}:AM${row},"PF")+COUNTIF(I${row}:AM${row},"P")+COUNTIF(I${row}:AM${row},"HDF")+COUNTIF(I${row}:AM${row},"HDA")++COUNTIF(I${row}:AM${row},"PHDF")++COUNTIF(I${row}:AM${row},"PHDA")`, result: 0,  date1904: false };
       

        cell = worksheet.getCell(`AQ${row}`);
        cell.value = null;
          cell.value = { formula: `=+AP${row}/7`, result: 0,  date1904: false };
        

        cell = worksheet.getCell(`AR${row}`);
         cell.value = null;
            cell.value = { formula: `=COUNTIF(I${row}:AM${row},"AH")`, result: 0,   date1904: false };
        
        cell = worksheet.getCell(`AS${row}`);
         cell.value = null;
          cell.value = { formula: `=COUNTIF(I${row}:AM${row},"PF")+COUNTIF(I${row}:AM${row},"PHDF")`, result: 0,  date1904: false };
        
  }
  const bufferWithNewData = await workbook.xlsx.writeBuffer({
    useStyles: true,
    useSharedStrings: true,
    filename: sheetName,
  });

  const base64 = (bufferWithNewData as Buffer).toString('base64');

  return base64;
};


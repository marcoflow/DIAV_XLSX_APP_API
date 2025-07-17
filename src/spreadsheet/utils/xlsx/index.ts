import { Workbook } from "exceljs";


export const parseXlsxWithExcelJs = async (
	spreadSheetBuffer: Buffer
): Promise<any[]> => {
	const workbook = new Workbook();

	await workbook.xlsx.load(spreadSheetBuffer);


	const worksheet = workbook.worksheets[0]; // get the first worksheet

	const data: any[] = [];

	worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		if (rowNumber === 1) {
			// Assuming first row contains header
			return;
		}

		const rowObj: any = {};
		row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
			const header = worksheet.getRow(1).getCell(colNumber);
			rowObj[header.text] = cell.text;
		});

		data.push(rowObj);
	});

	return data;
};
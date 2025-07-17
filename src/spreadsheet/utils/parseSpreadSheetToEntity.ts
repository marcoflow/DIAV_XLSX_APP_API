import * as ExcelJS from 'exceljs';

export const parseSpreadSheetToEntity = async <
	T extends Record<string, unknown>,
>(
	spreadSheetBuffer: Buffer,
	dataToEntity: DataToEntity<T>[],
	sheetNumber = 0,
	sheetStartRow = 1,
): Promise<
	Array<{
		[K in keyof T]: T[K];
	}>
> => {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(spreadSheetBuffer);
	const worksheet = workbook.worksheets[sheetNumber];

	const excelData: Record<string, unknown>[] = [];

	worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
		const isDataStartRow = rowNumber > sheetStartRow - 1;
		if (!isDataStartRow) return;

		let rowObject: any = {};

		row.eachCell((cell: ExcelJS.Cell) => {
			const columnLetterIndex = cell.col as unknown as number;
			const columnLetter = spreadSheetColumns[columnLetterIndex - 1];
			// If the column letter matches the column map, then we can use it
			const isRequiredColumn = dataToEntity.find(
				(data) => data.sheetColumn === columnLetter,
			);

			if (!isRequiredColumn) return;

			// Now, extract the data from the cell and add it to the row object with the parsed value (if it's a formula)
			const rawValue = cell.value;
			const parsedValue = cell.result;
			const value = parsedValue || rawValue;

			rowObject = {
				...rowObject,
				[isRequiredColumn.entityField]: value,
			};
		});

		excelData.push(rowObject);
	});

	return excelData as Array<Record<keyof T, any>>;
};

export const spreadSheetColumns = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'AA',
	'AB',
	'AC',
	'AD',
	'AE',
	'AF',
	'AG',
	'AH',
	'AI',
	'AJ',
	'AK',
	'AL',
	'AM',
	'AN',
	'AO',
	'AP',
	'AQ',
	'AR',
	'AS',
	'AT',
	'AU',
	'AV',
	'AW',
	'AX',
	'AY',
	'AZ',
] as const;

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type DataToEntity<T extends Record<string, unknown>> = {
	sheetColumn: ArrayElement<typeof spreadSheetColumns>;
	entityField: keyof T;
};

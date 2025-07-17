import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { addDataToSpreadSheet } from 'src/spreadsheet/utils/addDataToSpreadSheet';
import {
	ArrayElement,
	parseSpreadSheetToEntity,
} from 'src/spreadsheet/utils/parseSpreadSheetToEntity';
import { baseSpreadsheet } from 'src/static/baseSpreadsheet';
import {
	CreateSpreadsheetDto,
	ModelSchema,
} from './dto/create-spreadsheet.dto';

import { UpdateSpreadsheetDto } from './dto/update-spreadsheet.dto';
import { parseXlsxWithExcelJs } from './utils/xlsx';
import { excelDateToDate } from './utils/date';
import { fillGaps, fillGapsV2 } from './utils/fillGaps';
import { emptyUntil, getTypeOfTreatment } from './utils/utils';
import { convertToCode, parseTreatementData, typeToDescription } from './utils/newData';
import * as JSZip from 'jszip';
import * as path from 'path';
import * as fs from 'fs';
@Controller('spreadsheet')
export class SpreadsheetController {
	constructor() { }


	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async create(
		@Body()
		createSpreadsheetDto: CreateSpreadsheetDto,
		@UploadedFile() file: Express.Multer.File,
	) {
		const orginalFileName = file.originalname;
		const baseSpreadSheetBuffer = Buffer.from(baseSpreadsheet, 'base64');

		const DEFAULT_SHEET_EXPORT_START_ROW = 7;

		// parseXlsxWithExcelJs
		// const inputData = await parseXlsxWithExcelJs(baseSpreadSheetBuffer);

		// console.log(inputData);


		const match = file.originalname.match(/(\d{4})_(\d{2})/);

		

		// if (!createSpreadsheetDto.modelName) {
		// 	throw new HttpException('Model name is required', 400);
		// }

		// if (createSpreadsheetDto.modelSchema) {
		// 	const modelSchema = createSpreadsheetDto.modelSchema;
		// 	const modelSchemaIsArray = Array.isArray(modelSchema);

		// 	if (!modelSchemaIsArray) {
		// 		throw new HttpException('Model schema must be an array', 400);
		// 	}
		// }




		// SOURCE	clinic_id	clinic	PT_CD	FIRST_NAME	LAST_NAME	Personal billing document	Personal billing document - Trust that will get the billing	Sub system	1	2	3	4

		const modelSchema2: ModelSchema = [
			{ entityField: 'SOURCE', sheetColumn: 'A' },
			{ entityField: 'clinic_id', sheetColumn: 'B' },
			{ entityField: 'clinic', sheetColumn: 'C' },
			{ entityField: 'PT_CD', sheetColumn: 'D' },
			{ entityField: 'FIRST_NAME', sheetColumn: 'E' },
			{ entityField: 'LAST_NAME', sheetColumn: 'F' },
			{ entityField: 'Personal billing document', sheetColumn: 'G' },
			{ entityField: 'Personal billing document - Trust that will get the billing', sheetColumn: 'H' },
			{ entityField: 'Billing entity', sheetColumn: 'I' },
			{ entityField: 'Sub system', sheetColumn: 'J' },
			{ entityField: '1', sheetColumn: 'K' },
			{ entityField: '2', sheetColumn: 'L' },
			{ entityField: '3', sheetColumn: 'M' },
			{ entityField: '4', sheetColumn: 'N' },
			{ entityField: '5', sheetColumn: 'O' },
			{ entityField: '6', sheetColumn: 'P' },
			{ entityField: '7', sheetColumn: 'Q' },
			{ entityField: '8', sheetColumn: 'R' },
			{ entityField: '9', sheetColumn: 'S' },
			{ entityField: '10', sheetColumn: 'T' },
			{ entityField: '11', sheetColumn: 'U' },
			{ entityField: '12', sheetColumn: 'V' },
			{ entityField: '13', sheetColumn: 'W' },
			{ entityField: '14', sheetColumn: 'X' },
			{ entityField: '15', sheetColumn: 'Y' },
			{ entityField: '16', sheetColumn: 'Z' },
			{ entityField: '17', sheetColumn: 'AA' },
			{ entityField: '18', sheetColumn: 'AB' },
			{ entityField: '19', sheetColumn: 'AC' },
			{ entityField: '20', sheetColumn: 'AD' },
			{ entityField: '21', sheetColumn: 'AE' },
			{ entityField: '22', sheetColumn: 'AF' },
			{ entityField: '23', sheetColumn: 'AG' },
			{ entityField: '24', sheetColumn: 'AH' },
			{ entityField: '25', sheetColumn: 'AI' },
			{ entityField: '26', sheetColumn: 'AJ' },
			{ entityField: '27', sheetColumn: 'AK' },
			{ entityField: '28', sheetColumn: 'AL' },
			{ entityField: '29', sheetColumn: 'AM' },
			{ entityField: '30', sheetColumn: 'AN' },
			{ entityField: '31', sheetColumn: 'AO' },
			// map from 1 to 31 from J to AN
			// { entityField: '1', sheetColumn: 'J' },
			// { entityField: '2', sheetColumn: 'K' },
			// { entityField: '3', sheetColumn: 'L' },
			// { entityField: '4', sheetColumn: 'M' },
			// { entityField: '5', sheetColumn: 'N' },
			// { entityField: '6', sheetColumn: 'O' },
			// { entityField: '7', sheetColumn: 'P' },
			// { entityField: '8', sheetColumn: 'Q' },
			// { entityField: '9', sheetColumn: 'R' },
			// { entityField: '10', sheetColumn: 'S' },
			// { entityField: '11', sheetColumn: 'T' },
			// { entityField: '12', sheetColumn: 'U' },
			// { entityField: '13', sheetColumn: 'V' },
			// { entityField: '14', sheetColumn: 'W' },
			// { entityField: '15', sheetColumn: 'X' },
			// { entityField: '16', sheetColumn: 'Y' },
			// { entityField: '17', sheetColumn: 'Z' },
			// { entityField: '18', sheetColumn: 'AA' },
			// { entityField: '19', sheetColumn: 'AB' },
			// { entityField: '20', sheetColumn: 'AC' },
			// { entityField: '21', sheetColumn: 'AD' },
			// { entityField: '22', sheetColumn: 'AE' },
			// { entityField: '23', sheetColumn: 'AF' },
			// { entityField: '24', sheetColumn: 'AG' },
			// { entityField: '25', sheetColumn: 'AH' },
			// { entityField: '26', sheetColumn: 'AI' },
			// { entityField: '27', sheetColumn: 'AJ' },
			// { entityField: '28', sheetColumn: 'AK' },
			// { entityField: '29', sheetColumn: 'AL' },
			// { entityField: '30', sheetColumn: 'AM' },
			// { entityField: '31', sheetColumn: 'AN' },
		];





		// const alreadyHasModelNameFromAnotherSpreadSheet =
		// 	await this.spreadsheetService.getSpreadSheetByModelName(
		// 		createSpreadsheetDto.modelName,
		// 	);

		// if (alreadyHasModelNameFromAnotherSpreadSheet) {
		// 	const model =
		// 		typeof alreadyHasModelNameFromAnotherSpreadSheet.modelSchema ===
		// 			'string'
		// 			? JSON.parse(alreadyHasModelNameFromAnotherSpreadSheet.modelSchema)
		// 			: alreadyHasModelNameFromAnotherSpreadSheet.modelSchema;

		// 	// Por enquanto não fazer nada, mas no futuro pode ser necessário
		// 	// modelSchema = model;
		// }

		const DEFAULT_SHEET = 0;
		const DEFAULT_SHEET_START_ROW = 2;
		// const DEFAULT_SHEET_START_ROW = 1;
		const spreadSheetData = await parseSpreadSheetToEntity(
			file.buffer,
			modelSchema2,
			DEFAULT_SHEET,
			DEFAULT_SHEET_START_ROW,
		);

		// loop through spreadSheetData and parse 1-31 columns
		const parsedSpreadSheetData = spreadSheetData.map((patient) => {

			const parsedPatient = {
				...patient,
				calendar: [],
				codeCalendar: [],
			};

			for (let i = 0; i < 31; i++) {
				parsedPatient.calendar.push("");
			}

			for (let i = 1; i <= 31; i++) {
				const day = i;
				const treatment = patient[day.toString()] as string;
				const parsedTreatment = parseTreatementData(treatment);
				parsedPatient.calendar[day - 1] = parsedTreatment;
				parsedPatient.codeCalendar[day - 1] = convertToCode(parsedTreatment);
			}

			return parsedPatient;
		});






		//console.log(parsedSpreadSheetData[0]);






		let rows = parsedSpreadSheetData.map((data) => {

			const patientTreatment = data.calendar.find((day) => day !== undefined && day !== null && day.treatment === 'treatment');

			const DESCRIPTION = patientTreatment ? typeToDescription(patientTreatment.treatmentType) : "";


			const facturationDays = data.codeCalendar.filter(item =>
				["A", "AC", "PF", "P", "HDF", "HDA", "PHDF", "PHDA"].includes(item)
			).length

			if (facturationDays === 0) {
				return null;
			}

			// if any of the days of code calendar is HDF, then changee all A to HDA
			if (data.codeCalendar.includes("HDF")) {
				data.codeCalendar = data.codeCalendar.map((day) => {
					if (day === "A") {
						return "HDA"
					}
					return day;
				})
			}

			// if theres 4 or more As in a row, change them to undefined
			for (let i = 0; i < data.codeCalendar.length; i++) {
				const day = data.codeCalendar[i];
				if (day === "A") {
					if (data.codeCalendar[i + 1] === "A" && data.codeCalendar[i + 2] === "A" && data.codeCalendar[i + 3] === "A") {
						data.codeCalendar[i] = undefined;
						data.codeCalendar[i + 1] = undefined;
						data.codeCalendar[i + 2] = undefined;
						data.codeCalendar[i + 3] = undefined;
						i += 4;
					}
				}
			}


			return {
				A: data['clinic'],
				B: '',
				C: data['FIRST_NAME'] + ' ' + data['LAST_NAME'],
				D: data['Personal billing document - Trust that will get the billing'] || data['Personal billing document'],
				// get the first calandar where there is a treatment
				E: DESCRIPTION,
				F: data['Billing entity'] || "Não Informado",
				G: data['Sub system'],
				H: data['Sub system'],
				// data.calendar.map((day, index) => ({ [index + 1]: day !== 0 ? day : '' })),
				I: data.codeCalendar[0],
				J: data.codeCalendar[1],
				K: data.codeCalendar[2],
				L: data.codeCalendar[3],
				M: data.codeCalendar[4],
				N: data.codeCalendar[5],
				O: data.codeCalendar[6],
				P: data.codeCalendar[7],
				Q: data.codeCalendar[8],
				R: data.codeCalendar[9],
				S: data.codeCalendar[10],
				T: data.codeCalendar[11],
				U: data.codeCalendar[12],
				V: data.codeCalendar[13],
				W: data.codeCalendar[14],
				X: data.codeCalendar[15],
				Y: data.codeCalendar[16],
				Z: data.codeCalendar[17],
				AA: data.codeCalendar[18],
				AB: data.codeCalendar[19],
				AC: data.codeCalendar[20],
				AD: data.codeCalendar[21],
				AE: data.codeCalendar[22],
				AF: data.codeCalendar[23],
				AG: data.codeCalendar[24],
				AH: data.codeCalendar[25],
				AI: data.codeCalendar[26],
				AJ: data.codeCalendar[27],
				AK: data.codeCalendar[28],
				AL: data.codeCalendar[29],
				AM: data.codeCalendar[30],
				
				AN: data.codeCalendar.filter((day) => ["HDF"].includes(day)).length,
				AO: data.codeCalendar.filter((day) => ["AC"].includes(day)).length,
				AP: facturationDays,
				AQ: facturationDays / 7,
				AR: data.codeCalendar.filter((day) => ["AH"].includes(day)).length,
				AS: data.codeCalendar.filter((day) => ["PF"].includes(day) || ["PHDF"].includes(day)).length,
				AT: '',
				AU: '', // empty
				AV: match[1], 
				AW: match[2], 
			};
		})
			.filter((row) => row !== null);

		// remove null rows




		const rowsByClinic = rows.reduce((acc, row) => {
			const clinic = row.A;

			if (!acc[clinic]) {
				acc[clinic] = [];
			}

			acc[clinic].push(row);

			return acc;
		}, {});

		//console.log(rowsByClinic);





		const clinicNamesOrdered = []
		const zip = new JSZip();


		const summary = {}

		const spreadsheetsByClinic = await Promise.all(Object.keys(rowsByClinic).map(async (clinic) => {
			const rows = rowsByClinic[clinic];

			const finalRows = [{
				A: '',
				B: '',
				C: '',
				D: '',
				E: '',
				F: '',
				G: '',
				H: '',
				I: '',
				J: '',
				K: '',
				L: '',
				M: '',
				N: '',
				O: '',
				P: '',
				Q: '',
				R: '',
				S: '',
				T: '',
				U: '',
				V: '',
				W: '',
				X: '',
				Y: '',
				Z: '',
				AA: '',
				AB: '',
				AC: '',
				AD: '',
				AE: '',
				AF: '',
				AG: '',
				AH: '',
				AI: '',
				AJ: '',
				AK: '',
				AL: '',
				AM: '',
				// SUM of all AN:
				AN: rows.reduce((acc, row) => acc + row.AN, 0),
				// SUM of all AO:
				AO: rows.reduce((acc, row) => acc + row.AO, 0),
				// SUM of all AP:
				AP: rows.reduce((acc, row) => acc + row.AP, 0),
				// SUM of all AQ:
				AQ: rows.reduce((acc, row) => acc + row.AQ, 0),
			},
			{},
			{
				...emptyUntil(38),
				AN: 'Total de facturação',
				AO: '',
				AP: rows.reduce((acc, row) => acc + row.AP, 0) * 67.156,

			}
			]

			const completeRows = [
				
				...rows,
				//...finalRows
			];

			summary[clinic] = {
				'Total Facturação': rows.reduce((acc, row) => acc + row.AP, 0) * 67.156,
				'Facturação dias': rows.reduce((acc, row) => acc + row.AP, 0),
				'Facturação dias / 7': rows.reduce((acc, row) => acc + row.AP, 0) / 7,
				'Facturação dias HDF': rows.reduce((acc, row) => acc + row.AN, 0),
				'Facturação dias AC': rows.reduce((acc, row) => acc + row.AO, 0),
			}

			const dataToReturn = await addDataToSpreadSheet(
				baseSpreadSheetBuffer,
				clinic,
				completeRows,
				DEFAULT_SHEET_EXPORT_START_ROW,
				orginalFileName
				
			);

			clinicNamesOrdered.push(clinic);

			zip.file(`Mapa de Faturacao ${clinic}.xlsx`, dataToReturn, { base64: true });

			return dataToReturn;
		}
		));

		// turn the summary json into a spreadsheet file

		const summaryRows = Object.keys(summary).map((clinic) => {
			return {
				A: clinic,
				B: summary[clinic]['Total Facturação'],
				C: summary[clinic]['Facturação dias'],
				D: summary[clinic]['Facturação dias / 7'],
				E: summary[clinic]['Facturação dias HDF'],
				F: summary[clinic]['Facturação dias AC'],
			}
		});

		// header

		const header = [
			{
				A: 'Clinica',
				B: 'Total Facturação',
				C: 'Facturação dias',
				D: 'Facturação dias / 7',
				E: 'Facturação dias HDF',
				F: 'Facturação dias AC',
			}
		];

		const csv = header.concat(summaryRows).map((row) => {
			return Object.values(row).join(';');
		}
		).join('\n');

		const resumoBase64 = Buffer.from(csv).toString('base64');

		// summary
		zip.file(`Resumo.csv`, resumoBase64, { base64: true });

		// compress all base64 spreadsheets into a zip file
		// const zip = new JSZip();

		// spreadsheetsByClinic.forEach((spreadsheet, index) => {
		// 	zip.file(`Mapa de Faturacao ${clinicNamesOrdered[index]}.xlsx`, spreadsheet, { base64: true });
		// });

		const content = await zip.generateAsync({ type: 'base64' });
		//gravar ficheiro em disco
		const fileName = `file-${Date.now()}.zip`;
    	const filePath = path.join(__dirname, '..', 'uploads', fileName);
		 // Cria o diretório se não existir
		 if (!fs.existsSync(path.dirname(filePath))) {
			fs.mkdirSync(path.dirname(filePath), { recursive: true });
		  }
		// Gera o conteúdo do ZIP
		const zipContent = await zip.generateAsync({
			type: 'nodebuffer',
			compression: 'DEFLATE',
			compressionOptions: { level: 6 }
		});
		  // Escreve o arquivo no disco
		  fs.writeFileSync(filePath, zipContent);


		return content;

	}





}

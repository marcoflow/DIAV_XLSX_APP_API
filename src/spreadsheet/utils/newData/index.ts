const statusData = {
	"ACTIVE": {
		"DESCRIPTION": "Active",
		"CATEGORY_CD": "ADMIT"
	},
	"ACUTE": {
		"DESCRIPTION": "Acute",
		"CATEGORY_CD": "ADMIT"
	},
	"CARDIAC": {
		"DESCRIPTION": "Cardiac",
		"CATEGORY_CD": "DEATH"
	},
	"CEREBRAL": {
		"DESCRIPTION": "Vascular",
		"CATEGORY_CD": "DEATH"
	},
	"DISCPC": {
		"DESCRIPTION": "Permanent Discharge - Stopped Treatment Voluntarily (decision by patient/relatives)",
		"CATEGORY_CD": "DISCHARG"
	},
	"DISCPR": {
		"DESCRIPTION": "Permanent Discharge - Discontinued Dialysis (decision by physician)",
		"CATEGORY_CD": "DISCHARG"
	},
	"DOTHER": {
		"DESCRIPTION": "Other",
		"CATEGORY_CD": "DEATH"
	},
	"DUPLICAT": {
		"DESCRIPTION": "Permanent Discharge - Duplicate Patient",
		"CATEGORY_CD": "DISCHARG"
	},
	"ENDOCRIN": {
		"DESCRIPTION": "Endocrine",
		"CATEGORY_CD": "DEATH"
	},
	"GASINTES": {
		"DESCRIPTION": "Gastro-intestinal",
		"CATEGORY_CD": "DEATH"
	},
	"HOSPITAL": {
		"DESCRIPTION": "Hospitalized Away",
		"CATEGORY_CD": "ADMIT"
	},
	"HOSPITAL_ACTIVE": {
		"DESCRIPTION": "Hospitalized Active",
		"CATEGORY_CD": "ADMIT"
	},
	"INFECTIN": {
		"DESCRIPTION": "Infection",
		"CATEGORY_CD": "DEATH"
	},
	"LIVRDIS": {
		"DESCRIPTION": "Liver Disease",
		"CATEGORY_CD": "DEATH"
	},
	"METABOLC": {
		"DESCRIPTION": "Metabolic",
		"CATEGORY_CD": "DEATH"
	},
	"REGAIN": {
		"DESCRIPTION": "Permanent Discharge - Renal Function Recovered",
		"CATEGORY_CD": "DISCHARG"
	},
	"REGISTER": {
		"DESCRIPTION": "Registered",
		"CATEGORY_CD": "DISCHARG"
	},
	"RETURNED": {
		"DESCRIPTION": "Returned",
		"CATEGORY_CD": "DISCHARG"
	},
	"TRANDISC": {
		"DESCRIPTION": "Discharge - Transient",
		"CATEGORY_CD": "DISCHARG"
	},
	"TRANS": {
		"DESCRIPTION": "Permanent Discharge - Transplanted",
		"CATEGORY_CD": "DISCHARG"
	},
	"TRANS_HOME_HD": {
		"DESCRIPTION": "Permanent Discharge - Transferred to Home HD",
		"CATEGORY_CD": "DISCHARG"
	},
	"TRANSFER": {
		"DESCRIPTION": "Permanent Discharge - Transfer to Other Center (Patient Choice)",
		"CATEGORY_CD": "DISCHARG"
	},
	"TRANSFERRED": {
		"DESCRIPTION": "Transferred",
		"CATEGORY_CD": "DISCHARG"
	},
	"TRANSHD": {
		"DESCRIPTION": "Permanent Discharge - Transferred to HD",
		"CATEGORY_CD": "DISCHARG"
	},
	"TRANSHOSP": {
		"DESCRIPTION": "Permanent Discharge - Transfer to Hospital for Medical Reasons",
		"CATEGORY_CD": "DISCHARG"
	},
	"TRANSIE": {
		"DESCRIPTION": "Transient",
		"CATEGORY_CD": "ADMIT"
	},
	"TRANSMED": {
		"DESCRIPTION": "Permanent Discharge - Transfer to Other Center (Medical Reason)",
		"CATEGORY_CD": "DISCHARG"
	},
	"TRANSPD": {
		"DESCRIPTION": "Permanent Discharge - Transferred to PD",
		"CATEGORY_CD": "DISCHARG"
	},
	"VACATION": {
		"DESCRIPTION": "Away",
		"CATEGORY_CD": "DISCHARG"
	}
};


// ABF
// APD
// CAPD
// HD
// HDFPO
// HDFPR
// HDPER
// HFLUX
// HFPO
// HFPR
// IPD


type ModalityType = 'ABF' | 'APD' | 'CAPD' | 'HD' | 'HDFPO' | 'HDFPR' | 'HDPER' | 'HFLUX' | 'HFPO' | 'HFPR' | 'IPD' | 'TRANDISC' | 'ACTIVE'


type PatientRecord = {
	type: 'Permanent patient' | 'Transient patient';
	treatment: 'treatment' | 'no treatment';
	treatmentType?: ModalityType;
	status: string;
	statusDetail?: string;
	action: string;
	raw: string;
};

function trimmed(input: string): string {
	// remove spaces at the beginning and end
	try {
		let output = input.trim();
		return output;

	} catch (error) {
		return ''
	}

}

export function parseTreatementData(input: string): PatientRecord {





	if (!input || input === '' || input === ' ') {
		return undefined;
	}

	// sometimes thee input is two string separated by a arrow -> 
	// we only want the second one
	if (input?.includes('->')) {
		input = input.split('->')[1];
	}






	const fields = input.split('|').map(field => field.trim());

	const record: PatientRecord = {
		type: trimmed(fields[0]) as 'Permanent patient' | 'Transient patient',
		treatment: trimmed(fields[1]) as 'treatment' | 'no treatment',
		treatmentType: trimmed(fields[2]) !== '-' ? fields[2] as ModalityType : undefined,
		status: trimmed(fields[3]),
		statusDetail: trimmed(fields[4]) !== '-' ? trimmed(fields[4]) : undefined,
		action: trimmed(fields[5]),
		raw: input
	};
	return record

}


// Converte para os codigos que eles usam
// A = Doente da Clinica
// P = Doente de outra clinina em Transito
//
// AC = Ativo com tratamento de dialise
// AH = Ativo com internamento
// AF = ativo de férias
// 
// PF = passivo de férias
// PH = passivo de internamento
//
// HDF = ativo com Hemodialise de infiltracao com tratamento
// HDA = ativo com Hemodialise de infiltracao sem tratamento
//
// PHDF = passivo com Hemodialise de infiltracao com tratamento
// PHDA = passivo com Hemodialise de infiltracao sem tratamento


// Modality to code
// MODALITY_TYPE_CD	DIALYSIS_TYPE	MODALITY_DESC	CONV_CODE
// ABF	HEMO	ABF	HDF
// APD	PD	APD	PD
// CAPD	PD	CAPD	PD
// HD	HEMO	Low flux hemodialysis	HD
// HDFPO	HEMO	HDF-Postdilution	HDF
// HDFPR	HEMO	HDF-Predilution	HDF
// HDPER	HEMO	Hemoperfusion	
// HFLUX	HEMO	High flux hemodialysis	HD
// HFPO	HEMO	HF-Postdilution	HF
// HFPR	HEMO	HF-Predilution	HF
// IPD	PD	Intermittent Peritoneal Dialysis	PD

export function convertToCode(input: PatientRecord): string {

	if (!input) {
		return undefined;
	}
	
	const { type, treatment, treatmentType, status, statusDetail, action, raw } = input;

	if (status == 'TRANSDISC') {
		console.log("ALOO")
		//console.log(input)
	}
	if (raw == ''){
		return '';
	}
	if (raw.includes('RETURN_TO_PERMANENT_CLINIC')) {
		return undefined;
	}


	if (type == 'Permanent patient' && treatment == 'no treatment' && status == 'ACTIVE') {
		return 'A';
	}

	if (type == 'Transient patient' && treatment == 'no treatment' && status == 'ACTIVE') {
		return 'P';
	}

	


	// transient





	// const HDFlist = ['HD', 'HDFPO', 'HDFPR', 'HFLUX', 'HFPO', 'HFPR']
	// HDFPO
	// HDFPR
	const HDFlist = ['HDFPO', 'HDFPR',]
	const HDlist = ['HD', 'HFLUX', 'HFPO', 'HFPR']



	if (type == 'Transient patient' && treatment == 'treatment' && status == 'TRANSIE' && HDlist.includes(treatmentType)) {
		return 'PF';
	}

	if (type == 'Transient patient' && treatment == 'no treatment' && status == 'TRANSIE') {
		return 'P';
	}

	// Transient patient | no treatment | TRANDISC | - | RETURN_TO_PERMANENT_CLINIC
	if (type == 'Transient patient' && treatment == 'no treatment' && treatmentType == 'TRANDISC') {
		return 'P';
	}

	// Permanent patient | no treatment | ACTIVE | - | HOSPITALIZE_END
	// Bug this was not supposed to be in this order, thre should be a - between no treatment and ACTIVE
	if (type == 'Permanent patient' && treatment == 'no treatment' && treatmentType == 'ACTIVE') {
		return 'A';
	}




	if (type == 'Permanent patient' && treatment == 'treatment' && status == 'ACTIVE' && HDFlist.includes(treatmentType)) {
		return 'HDF';
	}

	if (type == 'Permanent patient' && treatment == 'no treatment' && status == 'ACTIVE' && HDFlist.includes(treatmentType)) {
		return 'HDA';
	}

	// A and AC

	if (treatment == 'no treatment' && status == 'ACTIVE' && HDlist.includes(treatmentType)) {
		return 'A';
	}

	if (treatment == 'treatment' && status == 'ACTIVE' && HDlist.includes(treatmentType)) {
		return 'AC';
	}

	if (type == 'Transient patient' && treatment == 'treatment' && status == 'ACTIVE' && HDFlist.includes(treatmentType)) {  // treatmentType in ['HD', 'HDFPO', 'HDFPR', 'HFLUX', 'HFPO', 'HFPR']) {
		return 'PHDF';
	}

	if (type == 'Transient patient' && treatment == 'no treatment' && status == 'ACTIVE' && HDFlist.includes(treatmentType)) {
		return 'PHDA';
	}

	if (type == 'Permanent patient' && treatment == 'treatment' && status == 'ACTIVE' && treatmentType == 'CAPD') {
		return 'PD';
	}

	

	//NEW CODS:
	if (type == 'Permanent patient' && treatment == 'no treatment' && status == 'VACATION') {
		return 'AF';
	}
	if (type == 'Permanent patient' && treatment == 'no treatment' && status == 'ACTIVE') {
		return 'A';
	}
	if (type == 'Permanent patient' && treatment == 'treatment' && statusDetail == 'READMIT') {
		return 'AC';
	}

	if (type == 'Permanent patient' && treatment == 'no treatment' && treatmentType == null && status == '' && statusDetail == 'TRANSIE' && action == 'TRANSEXT') {
		return 'P';
	}

	if (type == 'Permanent patient' && treatment == 'treatment' && HDlist.includes(treatmentType) && status == 'TRANSIE' && statusDetail == 'TRANSEXT' && action == 'ADMIT_TEMPORARY') {
		return 'PF';
	}

	if (type == 'Permanent patient' && treatment == 'treatment' && HDlist.includes(treatmentType) && status == 'ACTIVE' && statusDetail == 'READMIT' ) {
		return 'HDF';
	}

	if (type == 'Permanent patient' && treatment == 'no treatment' && HDlist.includes(treatmentType) && status == 'ACTIVE' && statusDetail == 'READMIT') {
		return 'HDA';
	}
	
	if (type == 'Transient patient' && treatment == 'treatment' && HDlist.includes(treatmentType) && status == 'ACTIVE') {
		return 'PHDF'
	}

	 // Condição especial PHDF
	if (
		type === 'Transient patient' &&
		treatment === 'treatment' &&
		HDlist.includes(treatmentType) &&
		status === 'ACTIVE'
	) {
		return 'PHDF';
	}

	// Condição especial PHDA
	if (
		type === 'Transient patient' &&
		treatment === 'treatment' &&
		HDlist.includes(treatmentType)
	) {
		return 'PHDA';
	}

	// Grupos de treatmentTypes
	const groupA = [
		'TRANSFER_ADDRCH', 'CARMIA', 'VACATION', 'TRANSFER_REALLOC', 'LEAVEINTERNAL',
		'RETURNED', 'TRANSFER_OTHER', 'OTHER', 'INJ/ACC', 'TRANSFER_HOLIDAY'
	];

	const groupAF = ['VACEXT'];

	const groupAC = ['CANC/NEO', 'OTHER'];

	const groupAH = [
		'INFRESP', 'HOSPITAL', 'CARDHD', 'INFBLD', 'INFOTH', 'RESPOTH', 'CIRCUL',
		'CERHFS', 'CARVHD', 'ACCINF', 'DIGEST', 'INFCOVID', 'INFSEPO', 'INFPIPI',
		'CEREBRO', 'CERMII B', 'GENITOUR', 'DOTUNK', 'NERVOUS', 'OTHPRDCA', 'INFBDPV',
		'CARCDHF', 'PDACAPLCM', 'MENTAL', 'CARDVES', 'INFBDPV', 'ACCPLA', 'MUSCOLO',
		'ACCOTH', 'METABOL', 'CARCACU'
	];

	const groupP = [
		'TRANSFERRED', 'TRANSIN', 'TRANSOUT', 'TRANSIE', 'TRANSNEX', 'TRANSFER_PT_CHOICE',
		'TRANS_OTH_EXT', 'TRANSFER_OTHER'
	];

	const groupPH = ['INFBOUND', 'HOSPITAL'];

	const groupPF = ['TRANSDIA', 'TRANS_OTH_DIA', 'TRANS_OTH_EXT'];

	// Retornos conforme grupo
	if (type === 'Permanent patient' && treatment === 'no treatment' && groupA.includes(treatmentType)) return 'A';
	if (type === 'Permanent patient' && treatment === 'no treatment' && groupAF.includes(treatmentType)) return 'AF';
	if (type === 'Permanent patient' && treatment === 'treatment' && groupAF.includes(treatmentType)) return 'AF';
	if (type === 'Permanent patient' && treatment === 'treatment' && groupAC.includes(treatmentType)) return 'AC';
	if (type === 'Permanent patient' && treatment === 'no treatment' && groupAH.includes(treatmentType)) return 'AH';
	if (type === 'Permanent patient' && treatment === 'treatment' && groupAH.includes(treatmentType)) return 'AH';
	if (type === 'Transient patient' && treatment === 'no treatment' && groupP.includes(treatmentType)) return 'P';
	if (type === 'Transient patient' && treatment === 'treatment' && groupPF.includes(treatmentType)) return 'PF';
	if (type === 'Transient patient' && treatment === 'treatment' && groupPH.includes(treatmentType)) return 'PH';
	if (type === 'Transient patient' && treatment === 'no treatment' && groupPH.includes(treatmentType)) return 'PH';

	if (raw.includes('ACTIVE')) {
		return 'A';
	}


	if (raw.includes('ATIVO')) {
		return 'A';
	}

	if (raw.includes('ACTIVO')) {
		return 'A';
	}
//type, treatment, treatmentType, status, statusDetail, action, raw 


	// if (status == 'ACTIVE' || treatmentType == 'ACTIVE') {
	// 	return 'A';
	// }

	if (raw.length > 0){
		//console.log(type + " - " + treatment + " - " + status);
	}

	// if (type == 'Permanent patient' && treatment == 'treatment' && status == 'ACTIVE' && ['HFPO', 'HFPR'].includes(treatmentType)) {
	// 	return 'HD';
	// }
	//console.log(input.raw);
	return '';
	//return undefined;
}


// MODALITY_TYPE_CD	DIALYSIS_TYPE	MODALITY_DESC	CONV_CODE
// ABF	HEMO	ABF	HDF
// APD	PD	APD	PD
// CAPD	PD	CAPD	PD
// HD	HEMO	Low flux hemodialysis	HD
// HDFPO	HEMO	HDF-Postdilution	HDF
// HDFPR	HEMO	HDF-Predilution	HDF
// HDPER	HEMO	Hemoperfusion	
// HFLUX	HEMO	High flux hemodialysis	HD
// HFPO	HEMO	HF-Postdilution	HF
// HFPR	HEMO	HF-Predilution	HF
// IPD	PD	Intermittent Peritoneal Dialysis	PD


export const typeToDescription = (type: string): string => {
	switch (type) {
		case 'ABF':
			return 'ABF';
		case 'APD':
			return 'APD';
		case 'CAPD':
			return 'CAPD';
		case 'HD':
			return 'Low flux hemodialysis';
		case 'HDFPO':
			return 'HDF-Postdilution';
		case 'HDFPR':
			return 'HDF-Predilution';
		case 'HDPER':
			return 'Hemoperfusion';
		case 'HFLUX':
			return 'High flux hemodialysis';
		case 'HFPO':
			return 'HF-Postdilution';
		case 'HFPR':
			return 'HF-Predilution';
		case 'IPD':
			return 'Intermittent Peritoneal Dialysis';
		default:
			return '';
	}
}


















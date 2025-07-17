export const getTypeOfTreatment = (patientRow: any) => {

	if (patientRow?.['NUMERO_TRATAMENTOS_CLINICA_HIGH_FLUX_HEMODIALYSIS'] === 1 || patientRow?.['NUMERO_TRATAMENTOS_CLINICA_LOW_FLUX_HEMODIALYSIS'] === 1) {
		return 'AC';
	}

	if (patientRow?.['NUMERO_TRATAMENTOS_CLINICA_HDF_PREDILUTION'] === 1 || patientRow?.['NUMERO_TRATAMENTOS_CLINICA_HDF_POSTDILUTION'] === 1) {
		return 'HDF';
	}

	return 'X'

}

export const emptyUntil = (until: number) => {
	const obj: any = {};
	for (let i = 1; i <= until; i++) {
		//obj[`key${i}`] = null;
		obj[`key${i}`] = '';
	}

	return obj
}


export const monthName = (month: string) => {
	switch (month) {
		case '01': return 'Janeiro';
		case '02': return 'Fevereiro';
		case '03': return 'Março';
		case '04': return 'Abril';
		case '05': return 'Maio';
		case '06': return 'Junho';
		case '07': return 'Julho';
		case '08': return 'Agosto';
		case '09': return 'Setembro';
		case '10': return 'Outubro';
		case '11': return 'Novembro';
		case '12': return 'Dezembro';
		default: return '';
	}
}
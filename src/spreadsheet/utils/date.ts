export function excelDateToDate(serial) {
	// JavaScript usa milissegundos desde a época Unix (1970), enquanto o Excel usa dias desde 1900.
	// Subtrair 25569 alinha as duas datas. Então, multiplicamos por 86400000 para converter dias em milissegundos.
	const date = new Date((serial - 25569) * 86400000);

	// Correção para o fuso horário
	date.setUTCMinutes(date.getUTCMinutes() + date.getTimezoneOffset());

	return date;
}
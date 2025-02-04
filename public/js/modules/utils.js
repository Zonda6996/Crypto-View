
// Формат числа вида: 00,000.00
export function formatNumber(n) {
	// Объект для форматирования числа
	const formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		useGrouping: true,
	})

	return formatter.format(n)
}

// Формат даты вида: 
export function formatDate(date) {
	// Преобразовываем строку в объект Date
	const dateObj = new Date(date)

	// Объект для форматирования даты
	const formattedDate = dateObj.toLocaleDateString('en-US', {
		year: 'numeric', 
		month: 'long',
		day: 'numeric',
	});

	return formattedDate;
}
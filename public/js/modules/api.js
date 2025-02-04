
const isDevelopment = false

// Получаем данные о монетах с API
export async function fetchCoinsData() {

	try {
		let response

		if (!isDevelopment) {
			response = await fetch('../../json/mockData.json')
		} else {
			response = await fetch(`http://localhost:5000/cryptos/`)
		}

		const coins = await response.json()
		return isDevelopment ? coins.data : coins
	} catch (error) {
		console.log('Ошибка при получении данных', error)
		return null
	}
}

// Получаем данные о новостях с API
export async function fetchNewsData() {

	try {
		const response = await fetch('http://localhost:5000/news')
		return await response.json()

	} catch (error) {
		console.log('Ошибка при загрузке новостей:', error)
		return null
	}
}

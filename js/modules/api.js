
const isDevelopment = true

export const API_URL = 'https://crypto-view-iik4.onrender.com'

// Получаем данные о монетах с API
export async function fetchMainCoinsData() {

	try {
		let response

		if (!isDevelopment) {
			response = await fetch('../../json/mockData.json')
		} else {
			response = await fetch(`${API_URL}/cryptos`)
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
		const response = await fetch(`${API_URL}/news`)
		return await response.json()

	} catch (error) {
		console.log('Ошибка при загрузке новостей:', error)
		return null
	}
}
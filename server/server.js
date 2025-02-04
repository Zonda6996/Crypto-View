// Подключаем библиотеку express для создания сервера
import express from 'express'
// Подключаем библиотеку axios для отправки запросов к внешним API
import axios from 'axios'
// Подключаем библиотеку cors, которая помогает избежать проблем с CORS
import cors from 'cors'
// Функция dirname, возвращает директорию, в которой находится файл, переданный в качестве аргумента
import path, { dirname } from 'path'
// Конвертирует URL в путь к файлу
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url) // Преобразуем URL в путь
const __dirname = dirname(__filename) // Получаем директорию

// API-Ключи
const COINMARKETCAP_API_KEY = '89917f4a-b8c9-4c0e-8735-0d93fc3950eb'
const NEWS_API_KEY = '9d6f7681568d4ae28c609cf275d7827a'

// Создаём приложение Express
const app = express()
const port = 5000

// Разрешаем все внешние источники (все домены) использовать наш сервер
app.use(cors())

// id для BTC, ETH, BNB, XRP, USDT, SOL
const COINS_IDS = [1, 1027, 1839, 52, 825, 5426]

app.get('/cryptos', async (req, res) => {
	const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'

	try {
		const response = await axios.get(url, {
			headers: {
				'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
				'Accept-Encoding': 'deflate, gzip',
				'Accept': 'application/json',
			},
			params: {
				id: COINS_IDS.join(','),
				convert: 'USD'
			}
		})

		res.json(response.data)
	} catch (error) {
		console.error('Ошибка при запросе данных:', error.message)
		res.status(500).json({ error: 'Ошибка при получении данных с CoinMarketCap API' });
	}
})

app.get('/price-conversion', async (req, res) => {
	const url = 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion'

	// Извлекаем параметры запроса
	const { amount = 1, symbol = 'BTC', convert = 'USD' } = req.query

	try {
		const response = await axios.get(url, {
			headers: {
				'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
				'Accept-Encoding': 'deflate, gzip',
				'Accept': 'application/json',
			},
			params: {
				amount,
				symbol,
				convert,
			},
		})

		res.json(response.data)
	} catch (err) {
		console.error('Ошибка при запросе данных', err.message)
		res.status(500).json({ error: 'Ошибка при получении данных с CoinMarketCap API' });
	}
})

app.get('/news', async (req, res) => {
	const oneMonthAgo = new Date()
	oneMonthAgo.setDate(oneMonthAgo.getDate() - 28)
	const formattedDate = oneMonthAgo.toISOString().split('T')[0]

	const url = `https://newsapi.org/v2/everything?q=crypto&from=${formattedDate}&sortBy=popularity&pageSize=5&apiKey=${NEWS_API_KEY}`;

	try {
		const response = await axios.get(url)
		res.json(response.data)

	} catch (error) {
		console.log('Error fetching news:', error)
	}
})

// Сервируем статические файлы из папки public
app.use(express.static(path.join(__dirname, '..', 'public')))

// Этот маршрут перехватывает все запросы, не совпавшие с предыдущими
app.get('*', (req, res) => {
	// Отправляем файл index.html для любых запросов
	res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'))
})


app.listen(5000, () => {
	console.log(`Сервер запущен на http://localhost:${port}`)
})

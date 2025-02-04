import { formatNumber, formatDate } from "./utils.js";
import { fetchCoinsData, fetchNewsData } from "./api.js";

// Реднерим информацию о монетах
export async function renderCoinsData() {

	const coins = await fetchCoinsData()
	if (!coins) return

	// Получаем каждый контейнер с коином
	const coinsEl = document.querySelectorAll('.cryptolist__coin')

	// Для каждой монеты
	coinsEl.forEach((element) => {

		// Получаем её data-атрибут с id
		const coinId = element.getAttribute('data-id')

		// Достаём информацию о каждой моненте по её ID
		const coinData = coins[coinId]
		// console.log(coinData)
		if (coinData) {
			// Элемент с ценой, изменением за 24ч
			const priceEl = element.querySelector('#coinPrice')
			const percentageChangeEl = element.querySelector('.cryptolist__price-change')
			// Достаём цену из объекта, процент изменения за 24ч
			const coinPrice = coinData.quote.USD.price
			const percentageChange = coinData.quote.USD.percent_change_24h

			// Размещаем цену, процент изменения в документ
			priceEl.textContent = `$${formatNumber(coinPrice)}`
			percentageChangeEl.textContent = `${formatNumber(percentageChange)}%`

			percentageChangeEl.classList.toggle('cryptolist__price-change-up', percentageChange > 0)
			percentageChangeEl.classList.toggle('cryptolist__price-change-down', percentageChange <= 0)

		}
	})
}

export async function renderNews() {
	const data = await fetchNewsData()
	if (!data) return

	// Перебираем каждый массив с новостями
	data.articles.forEach((article, index) => {

		// Находим карточку по индексу
		const newsItem = document.querySelectorAll('.news__item')[index]

		// Отрисовываем данные в элементы

		// Заголовок
		const newsTitle = newsItem.querySelector('.news__title')
		newsTitle.textContent = article.title

		// Описание
		const newsDescription = newsItem.querySelector('.news__description')
		newsDescription.textContent = article.description

		// Изображение
		const newsImage = newsItem.querySelector('.news__img img')
		newsImage.onload = () => newsImage.classList.add('loaded')
		newsImage.src = article.urlToImage || '/2024/Projects/Crypto View/img/newsPlaceholder.svg'

		// Дата публикации новости
		const newsDate = newsItem.querySelector('.news__date')
		newsDate.textContent = formatDate(article.publishedAt)

		// Автор
		const newsAuthor = newsItem.querySelector('.news__author')
		newsAuthor.textContent = `Author: ${article.author}`

		// Ссылка на новость
		const newsUrl = newsItem.querySelector('.news__more')
		const imageUrl = newsItem.querySelector('#imageHref')
		newsUrl.href = article.url
		imageUrl.href = article.url
		newsUrl.textContent = 'Learn More...'

		// Удаляем скелетон
		newsItem.querySelectorAll('.skeleton__small, .skeleton__medium, .skeleton__img')
			.forEach(el => el.classList.remove('skeleton__small', 'skeleton__medium', 'skeleton__img'))

	})
}
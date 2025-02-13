import { formatNumber, formatDate } from "./utils.js";
import { fetchMainCoinsData, fetchNewsData } from "./api.js";
import { toggleCoinDetails } from "./eventHanlers.js";

// Реднерим информацию о монетах
export async function renderCoinsData() {

	const coins = await fetchMainCoinsData()
	if (!coins) return

	// Получаем каждый контейнер с коином
	const coinsEl = document.querySelectorAll('.coin')

	// Для каждой монеты
	coinsEl.forEach((element) => {

		// Получаем её data-атрибут с id
		const coinId = element.getAttribute('data-id')

		// Достаём информацию о каждой моненте по её ID
		const coinData = coins[coinId]
		// console.log(coinData)
		if (coinData) {
			// Элемент с ценой, изменением за 24ч
			const priceEl = element.querySelector('.coin-price')
			const percentageChangeEl = element.querySelector('.price-change')
			// Достаём цену из объекта, процент изменения за 24ч
			const coinPrice = coinData.quote.USD.price
			const percentageChange24h = coinData.quote.USD.percent_change_24h

			// Размещаем цену, процент изменения в документ
			priceEl.textContent = `$${formatNumber(coinPrice)}`
			percentageChangeEl.textContent = `${formatNumber(percentageChange24h)}%`

			percentageChangeEl.classList.toggle('price-change-up', percentageChange24h > 0)
			percentageChangeEl.classList.toggle('price-change-down', percentageChange24h <= 0)

		}
	})
}

// Рендер новостей
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

// Рендер добавленных монет
export function renderAddedCoins() {
	const savedCoins = JSON.parse(localStorage.getItem('coins') || '[]')
	const addCoinWarn = document.querySelector('.favorites__add')
	const coinsContainer = document.querySelector('.favorites__coins')

	if (!savedCoins || savedCoins.length === 0) {
		addCoinWarn.classList.add('active')
		return
	}

	coinsContainer.innerHTML = ''

	savedCoins.forEach(coin => {
		const coinInner = document.createElement('div')
		coinInner.classList.add('favorites__coin-inner')

		coinInner.innerHTML = `
		<div class="favorites__coin">
			<div class="favorites__coin-icon-name">
				<img class="favorites__coin-icon" src="${coin.icon}" alt="${coin.name}">
				<p class="favorites__coin-name">${coin.symbol} Price (${coin.name})</p>
			</div>
			<div class="favorites__coin-price">
				${coin.name} TO&nbsp;<strong>USD</strong>: 1 ${coin.symbol} =
				<div class="change-font">&nbsp;<strong>$${coin.price} USD</strong>
					<span class="${coin.percent_change_24h > 0 ? 'positive' : 'negative'}">
						${coin.percent_change_24h > 0 ? '+' : ''}${coin.percent_change_24h}%
					</span>
					<span class="time-frame">1d.</span>
				</div>
			</div>
			<button class="favorites__more-details-btn">
				<span class="favorites__arrows-icon"></span> More Details
			</button>
			<div class="favorites__details">
				<div class="favorites__details-content">
					<p class="favorites__details-marketcap">Market Cap: $${coin.market_cap}</p>
					${[
				{ time: '1h', key: 'percent_change_1h' },
				{ time: '24h', key: 'percent_change_24h' },
				{ time: '7d', key: 'percent_change_7d' },
				{ time: '30d', key: 'percent_change_30d' },
				{ time: '60d', key: 'percent_change_60d' },
				{ time: '90d', key: 'percent_change_90d' },
			].map(({ time, key }) => `
			<p class="favorites__details-percent-change">
				Percent Change <span class="change-font">${time}: <span class="${coin[key] > 0 ? 'positive' : 'negative'}">${coin[key] > 0 ? '+' : ''}${coin[key]}%</span></span>
			</p>`).join('')}
				</div>
			</div>
		</div>
		<div class="favorites__coin-converter">
			<p class="favorites__coin-converter-text">Buy ${coin.name}</p>
			<div class="favorites__coin-converter-buy-input-inner"> You Buy
				<input class="favorites__coin-converter-buy-input" name="buy" placeholder="0" type="number">
			</div>
			<p class="favorites__coin-converter-price">
				1 ${coin.name} <span class="almost-equal">&asymp;</span> USD $<span class="coin-price">${coin.price}</span>
			</p>
			<div class="favorites__coin-converter-spend-input-inner"> You Spend
				<input class="favorites__coin-converter-spend-input" name="spend" placeholder="0" type="number">
			</div>
		</div>
		`;

		coinsContainer.append(coinInner)
	})
}
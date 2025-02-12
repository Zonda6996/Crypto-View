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

	if (!savedCoins || savedCoins.length === 0) {
		addCoinWarn.classList.add('active')
		return
	}


	const coinsContainer = document.querySelector('.favorites__coins')

	coinsContainer.innerHTML = ''

	savedCoins.forEach(coin => {
		// Разметка монеты
		const coinContainer = document.createElement('div')
		coinContainer.classList.add('favorites__coin')

		const coinIconNameCnt = document.createElement('div')
		coinIconNameCnt.classList.add('favorites__coin-icon-name')

		const coinIcon = document.createElement('img')
		coinIcon.classList.add('favorites__coin-icon')
		coinIcon.src = coin.icon

		const coinName = document.createElement('p')
		coinName.classList.add('favorites__coin-name')
		coinName.textContent = `${coin.symbol} Price (${coin.name})`

		const coinPriceCnt = document.createElement('div')
		coinPriceCnt.classList.add('favorites__coin-price-inner')

		const coinPrice = document.createElement('p')
		coinPrice.classList.add('favorites__coin-price')
		const percentChange24h = coin.percent_change_24h
		const percentClass = percentChange24h > 0 ? 'positive' : 'negative'
		const sign = percentChange24h > 0 ? '+' : ''

		coinPrice.innerHTML = `${coin.name} TO&nbsp;<strong>USD</strong>: 1 ${coin.symbol}
		 = <div class="change-font">&nbsp;<strong>$${coin.price} USD</strong>
		 <span class="${percentClass}">${sign}${percentChange24h}%</span>
		 <span class="time-frame">1d.</span></div>`

		const moreDetailsBtn = document.createElement('button')
		moreDetailsBtn.classList.add('favorites__more-details-btn')

		const arrowsIcon = document.createElement('span')
		arrowsIcon.classList.add('favorites__arrows-icon')

		const detailsContainer = document.createElement('div')
		detailsContainer.classList.add('favorites__details')

		const detailsContent = document.createElement('div')
		detailsContainer.classList.add('favorites__details-content')

		const marketCapEl = document.createElement('p')
		marketCapEl.classList.add('favorites__details-marketcap')
		marketCapEl.textContent = `Market Cap: $${coin.market_cap}`

		const percentChange1hEl = document.createElement('p')
		const percentChange24hEl = document.createElement('p')
		const percentChange7dEl = document.createElement('p')
		const percentChange30dEl = document.createElement('p')
		const percentChange60dEl = document.createElement('p')
		const percentChange90dEl = document.createElement('p')

		percentChange1hEl.classList.add('favorites__details-percent-change')
		percentChange24hEl.classList.add('favorites__details-percent-change')
		percentChange7dEl.classList.add('favorites__details-percent-change')
		percentChange30dEl.classList.add('favorites__details-percent-change')
		percentChange60dEl.classList.add('favorites__details-percent-change')
		percentChange90dEl.classList.add('favorites__details-percent-change')

		percentChange1hEl.innerText = `Percent Change 1h: ${coin.percent_change_1h}%`
		percentChange24hEl.innerText = `Percent Change 24h: ${coin.percent_change_24h}%`
		percentChange7dEl.innerText = `Percent Change 7d: ${coin.percent_change_7d}%`
		percentChange30dEl.innerText = `Percent Change 30d: ${coin.percent_change_30d}%`
		percentChange60dEl.innerText = `Percent Change 60d: ${coin.percent_change_60d}%`
		percentChange90dEl.innerText = `Percent Change 90d: ${coin.percent_change_90d}%`



		const coinInner = document.createElement('div')
		coinInner.classList.add('favorites__coin-inner')

		coinsContainer.append(coinInner)

		coinIconNameCnt.append(coinIcon, coinName)

		moreDetailsBtn.append(arrowsIcon, document.createTextNode('More Details'))

		detailsContainer.append(detailsContent)

		detailsContent.append(marketCapEl, percentChange1hEl, percentChange24hEl, percentChange7dEl, percentChange30dEl, percentChange60dEl, percentChange90dEl)

		coinContainer.append(coinIconNameCnt, coinPrice, moreDetailsBtn, detailsContainer)


		// Разметка конвертера к каждой монете
		const coinConverter = document.createElement('div')
		coinConverter.classList.add('favorites__coin-converter')

		const converterBuyText = document.createElement('p')
		converterBuyText.classList.add('favorites__coin-converter-text')
		converterBuyText.textContent = `Buy ${coin.name}`

		const converterBuyInner = document.createElement('div')
		converterBuyInner.classList.add('favorites__coin-converter-buy-input-inner')
		converterBuyInner.textContent = 'You Buy'

		const converterBuyInput = document.createElement('input')
		converterBuyInput.classList.add('favorites__coin-converter-buy-input')
		converterBuyInput.setAttribute("name", "buy")
		converterBuyInput.setAttribute("placeholder", "0")
		converterBuyInput.setAttribute("type", "number")

		const converterCoinPrice = document.createElement('p')
		converterCoinPrice.classList.add('favorites__coin-converter-price')
		converterCoinPrice.innerHTML = `1 ${coin.name} <span class="almost-equal">&asymp;</span> USD $<span class="coin-price">${coin.price}</span>`

		const converterSpendInner = document.createElement('div')
		converterSpendInner.classList.add('favorites__coin-converter-spend-input-inner')
		converterSpendInner.textContent = 'You Spend'


		const converterSpendInput = document.createElement('input')
		converterSpendInput.classList.add('favorites__coin-converter-spend-input')
		converterSpendInput.setAttribute("name", "spend")
		converterSpendInput.setAttribute("placeholder", "0")
		converterSpendInput.setAttribute("type", "number")



		coinInner.append(coinContainer)

		coinInner.append(coinConverter)

		converterBuyInner.append(converterBuyInput)
		converterSpendInner.append(converterSpendInput)

		coinConverter.append(converterBuyText, converterBuyInner, converterCoinPrice, converterSpendInner)
	})
}
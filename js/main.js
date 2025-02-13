// Импортируем модули
import { renderAddedCoins, renderCoinsData, renderNews } from "./modules/render.js";
import { initScrollToTitle, initProfileMenu, initCurrencyConverter, handleProfileClick, handlePopstate, handleModal, handleAuth, logOut, addCoins, coinsFollowing, toggleCoinDetails, initFavoritesCurrencyConverter, toggleAnswer } from "./modules/eventHanlers.js";


// Инициализируем модули
document.addEventListener('DOMContentLoaded', async () => {
	// Рендер данных с API
	renderCoinsData()
	renderAddedCoins()
	renderNews()

	handleProfileClick()
	window.addEventListener('popstate', handlePopstate)

	// Инициализация компонентов
	initScrollToTitle()
	initProfileMenu()
	initCurrencyConverter()
	initFavoritesCurrencyConverter()

	// Элементы управления
	handleModal()
	handleAuth()
	logOut()
	addCoins()
	toggleAnswer()
	coinsFollowing()
	toggleCoinDetails()
});

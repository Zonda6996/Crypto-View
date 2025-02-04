// Импортируем модули
import { renderCoinsData, renderNews } from "./modules/render.js";
import { initScrollToTitle, initProfileMenu, initCurrencyConverter, handleProfileClick, handlePopstate, switchPage, handleModal, handleAuth, loadDataProfile, logOut } from "./modules/eventHanlers.js";


// Инициализируем модули
document.addEventListener('DOMContentLoaded', () => {
	// Рендер данных с API
	renderCoinsData()
	// renderNews()

	handleProfileClick()
	window.addEventListener('popstate', handlePopstate)

	// Проверяем, какую страницу надо показать сразу при загрузке
	const page = window.location.pathname.slice(1) || 'main'
	switchPage(page)

	// Инициализация компонентов
	initScrollToTitle()
	initProfileMenu()
	initCurrencyConverter()

	// Показываем скрытые элементы
	handleModal()
	handleAuth()
	logOut()
});

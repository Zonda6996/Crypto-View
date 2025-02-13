import { formatNumber } from './utils.js';
import { AMOUNT_MAX_LENGTH } from './constatns.js';
import { fetchMainCoinsData } from './api.js';

// Плавный скролл
export function initScrollToTitle() {

	const moreBtn = document.querySelector('.hero-starts__button-more')
	const title = document.querySelector('.cryptolist__title')

	moreBtn.addEventListener('click', () => {
		title.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
	});
}

// DropDown меню при клике на профиль
export function initProfileMenu() {
	const page = window.location.pathname.slice(1) || 'index.html'

	// Определяем нужную кнопку на любой из страниц
	const selectors = {
		'index.html': '.header-profile__img',
		'profile': '.profile__header-user-img',
		'favorites': '.favorites__header-user-img',
		'settings': '.settings__header-user-img',
		// 'search': '.serach__header-user-img',
	}

	const oldProfileBtn = document.querySelector(selectors[page])
	const profileMenu = document.querySelector('.header-profile__dropdown')

	if (!oldProfileBtn || !profileMenu) return

	// Заменяем элемент на новый, чтобы удалить старые обработчики
	const profileBtn = oldProfileBtn.cloneNode(true)
	oldProfileBtn.replaceWith(profileBtn)

	profileBtn.addEventListener('click', (e) => {
		e.stopPropagation()
		profileMenu.classList.toggle('visible')
	});

	document.removeEventListener('click', closeMenu)
	document.addEventListener('click', closeMenu)

	function closeMenu(e) {
		if (!profileMenu.contains(e.target)) {
			profileMenu.classList.remove('visible')
		}
	}

	// Закрытие меню при клике в на одну из кнопок
	profileMenu.querySelectorAll('button').forEach(item => {
		item.removeEventListener('click', closeDropdown)
		item.addEventListener('click', closeDropdown)
	})

	function closeDropdown() {
		profileMenu.classList.remove('visible')
	}
}

function showLoadingIndicator() {
	const conversionResultEl = document.getElementById('converterResult')

	conversionResultEl.innerText = ''

	const loader = document.createElement('span')
	loader.className = 'loader'

	conversionResultEl.append(loader)
}

// Инициализируем конвертер меню
export function initCurrencyConverter() {
	// Форма 
	const converterForm = document.getElementById('converterForm');

	// При клике на кнопку обрабатываем введённые данные
	converterForm.addEventListener('submit', async (e) => {
		e.preventDefault()

		const conversionResultEl = document.getElementById('converterResult')
		const amount = document.getElementById('amount').value
		const fromCurrency = document.getElementById('fromCurrency').value
		const toCurrency = document.getElementById('toCurrency').value

		// Ограничение макс. символов
		if (amount.length > AMOUNT_MAX_LENGTH) {
			const amountEl = document.getElementById('amount')
			amountEl.classList.add('amount-length-error')

			conversionResultEl.innerText = ''

			const errorMessage = document.createElement('p')
			errorMessage.textContent = 'Amount should not exceed 10 digits.'
			errorMessage.className = 'error-message-length'

			conversionResultEl.append(errorMessage)

			setTimeout(() => amountEl.classList.remove('amount-length-error'), 3000)
			return
		}

		// Показываем ндикатор загрузки
		showLoadingIndicator()

		// Получаем результат конвертации от сервера (API)
		try {
			const response = await fetch(`http://localhost:5000/price-conversion?amount=${amount}&symbol=${fromCurrency}&convert=${toCurrency}`)
			const data = await response.json()

			const conversionResult = data.data.quote[toCurrency].price

			console.log(conversionResult)

			const resultText = `Convert Result: <strong>${amount}</strong> ${fromCurrency} = <strong>${formatNumber(conversionResult)}</strong> ${toCurrency}`
			conversionResultEl.innerHTML = resultText

		} catch (err) {
			console.log('Ошибка при получении данных:', err)
			conversionResultEl.innerText = 'Error converting, please try again.'
		}
	});

}

// Изменение страниц
export function handleProfileClick() {
	const myProfileLink = document.querySelector('.header-profile__dropdown-item[data-action="profile"]')
	const searchLink = document.querySelector('.header-profile__dropdown-item[data-action="search"]')
	const favoritesLink = document.querySelector('.header-profile__dropdown-item[data-action="favorites"]')
	const settingsLink = document.querySelector('.header-profile__dropdown-item[data-action="settings"]')
	const moreCoinsBtn = document.getElementById('moreCoins')
	const startFollowingBtn = document.getElementById('following')
	const startNowBtn = document.querySelector('.hero-starts__button-start')
	const addCoinLink = document.getElementById('addCoinLink')

	function changeUrl(urlName, e) {
		e.preventDefault()

		window.history.pushState({ page: urlName }, urlName, `/${urlName}`)

		switchPage(urlName)

		setTimeout(() => {
			initProfileMenu()
		}, 50)
	}

	if (myProfileLink) {
		myProfileLink.addEventListener('click', (event) => changeUrl('profile', event))
	}

	if (startNowBtn) {
		startNowBtn.addEventListener('click', (event) => changeUrl('profile', event))
	}

	if (addCoinLink) {
		const addCoinsBlock = document.querySelector('.profile__choise')

		addCoinLink.addEventListener('click', (event) => {
			changeUrl('profile', event)
			setTimeout(() => {
				addCoinsBlock.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
			}, 100)
		})
	}

	const isAuth = localStorage.getItem('isAuthenticated')

	// Массив с страницами, сразу проверка на авторизацию
	const pages = [
		{ element: searchLink, page: isAuth ? 'search' : 'profile' },
		{ element: favoritesLink, page: isAuth ? 'favorites' : 'profile' },
		{ element: settingsLink, page: isAuth ? 'settings' : 'profile' },
		{ element: moreCoinsBtn, page: isAuth ? 'search' : null },
		{ element: startFollowingBtn, page: isAuth ? 'favorites' : null },
	]

	// Для каждой кнопки вызываем свою страницу
	pages.forEach(({ element, page }) => {
		if (element && page) {
			element.addEventListener('click', (event) => changeUrl(page, event))
		}
	})
}

export function handlePopstate(event) {
	switchPage(window.location.pathname.slice(1) || 'index.html')
}

// Функция для переключения страниц
export function switchPage(page) {
	// Удаляем все классы "active" с элементов
	document.querySelectorAll('.page').forEach(section => section.classList.remove('active'))

	// Ищем нужную страницу и показываем её
	const targetPage = document.querySelector(`.page[data-page="${page}"]`)
	if (targetPage) {
		targetPage.classList.add('active')
	} else {
		document.querySelector(`.page[data-page="main"]`)?.classList.add('active')
	}
}

window.addEventListener('load', () => {
	handlePopstate({ state: window.history.state })
});


// Показываем моадльное окно для заполнения профиля
export function handleModal() {
	const loginBtn = document.getElementById('login')
	const modal = document.querySelector('.profile__auth-modal')
	const modalOverlay = document.querySelector('.profile__auth-modal-wrap')
	const closeBtn = document.getElementById('modalClose')

	function showModal() {
		modal.classList.add('profile__auth-modal-acitve')
	}


	function removeModal() {
		modal.classList.remove('profile__auth-modal-acitve')
	}

	loginBtn.addEventListener('click', showModal)
	closeBtn.addEventListener('click', removeModal)
	modalOverlay.addEventListener('mousedown', (e) => {
		if (e.target === modalOverlay) removeModal()
	})
}

// Обрабатываем заполнение профиля
export function handleAuth() {
	loadDataProfile() // Загружаем данные профиля
	// Форма и фото профиля
	const form = document.getElementById('profile-form')
	const avatarInput = document.getElementById('avatar')
	const avatarModalImg = document.getElementById('avatarModal')

	// Элементы интерфейса
	const headerName = document.querySelector('.header__username') // Имя в шапке на главной странице
	const profileName = document.querySelector('.profile__header-username') // Имя в шапке "My Profile"
	const searchName = document.querySelector('.search__header-username') // Имя в шапке на странице "Search" 
	const favoritesName = document.querySelector('.favorites__header-username') // Имя в шапке на странице "Favorites"
	const settingsName = document.querySelector('.settings__header-username') // Имя в шапке на странице "Settings"
	const mainGreeting = document.getElementById('mainGreeting') // Главное приветствие
	const textGreeting = document.querySelector('.profile__hero-subtitle') // Текст описывающий профиль
	const mainAvatarImg = document.getElementById('mainAvatar') // Аватарка в шапке на гланвной странице
	const profileAvatarImg = document.getElementById('profileAvatar') // Аватарка в шапке профиля
	const searchAvatarImg = document.getElementById('searchAvatar') // Аватарка в шапке 'Search'
	const favoritesAvatarImg = document.getElementById('favoritesAvatar') // Аватарка в шапке 'Favorites'
	const settingsAvatarImg = document.getElementById('settingsAvatar') // Аватарка в шапке 'Settings'
	const loginSection = document.querySelector('.profile__login') // Секция "Log In"
	const profileMain = document.querySelector('.profile__main-content') // Скрытая часть профиля
	const modal = document.querySelector('.profile__auth-modal') // Модальное окно
	const startNowBtn = document.querySelector('.hero-starts__button-start')

	// Восстанавливаем данные при загрузке страницы
	document.addEventListener('DOMContentLoaded', () => {
		const savedUsername = localStorage.getItem('username')
		const savedEmail = localStorage.getItem('email')
		const savedCoins = localStorage.getItem('favoriteCurrency')
		const savedAvatar = localStorage.getItem('avatar')

	});

	// Сохраняем аватарку
	avatarInput.addEventListener('change', () => {
		const file = avatarInput.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = function (event) {
				const avatarUrl = event.target.result
				avatarModalImg.src = avatarUrl
				localStorage.setItem('avatar', avatarUrl) // Сохраняеям как base64 строку
			}
			reader.readAsDataURL(file)
		}
	});

	form.addEventListener('submit', (e) => {
		e.preventDefault()

		// Сохраняем имя пользователя, email, монеты
		const username = document.getElementById('username').value
		const email = document.getElementById('email').value
		const favoriteCurrency = document.getElementById('favoriteCurrency').value

		// Сохраняем флаг, что пользователь авторизован
		localStorage.setItem('isAuthenticated', 'true')

		// Показываем загрузку
		const profileSection = document.querySelector('.profile')
		console.log(profileSection)
		const loading = document.createElement('div')
		loading.id = 'authLoading'

		profileSection.append(loading)
		setTimeout(() => {
			// Сохраняем данные в localStorage
			localStorage.setItem('username', username)
			localStorage.setItem('email', email)
			localStorage.setItem('favoriteCurrency', favoriteCurrency)
			const avatar = localStorage.getItem('avatar')

			// Обновляем UI
			profileName.textContent = username
			headerName.textContent = username
			settingsName.textContent = username
			mainGreeting.textContent = `Hello, ${username}!`
			textGreeting.textContent = `Welcome to Crypto View! Now you can follow cryptocurrency prices, add your favorite coins to portfolio and much more!`

			if (avatar) {
				mainAvatarImg.src = avatar
				profileAvatarImg.src = avatar
				settingsAvatarImg.src = avatar
				// searchAvatarImg.src = avatar

			}
			loginSection.style.display = 'none' // Скрываем секцию с логином
			startNowBtn.style.display = 'none' // Скрываем кнопку на главной странице
			profileMain.style.display = 'block' // Показываем основное содержимое страницы
			modal.classList.remove('profile__auth-modal-acitve')

			// Скрываем загрузку
			loading.style.display = 'none'
		}, 1500)
	});
}

// Загрузка сохранённых данных
export function loadDataProfile() {

	// Получаем элементы UI
	const headerName = document.querySelector('.header__username')
	const profileName = document.querySelector('.profile__header-username')
	const searchName = document.querySelector('.search__header-username')
	const favoritesName = document.querySelector('.favorites__header-username')
	const settingsName = document.querySelector('.settings__header-username') // Имя в шапке на странице "Settings"
	const mainGreeting = document.getElementById('mainGreeting')
	const mainAvatarImg = document.getElementById('mainAvatar')
	const profileAvatarImg = document.getElementById('profileAvatar')
	const searchAvatarImg = document.getElementById('searchAvatar')
	const favoritesAvatarImg = document.getElementById('favoritesAvatar')
	const settingsAvatarImg = document.getElementById('settingsAvatar') // Аватарка в шапке 'Settings'
	const loginSection = document.querySelector('.profile__login')
	const profileMain = document.querySelector('.profile__main-content')
	const startNowBtn = document.querySelector('.hero-starts__button-start')
	const savedUsername = localStorage.getItem('username')
	const savedAvatar = localStorage.getItem('avatar')

	// Обновляем UI
	if (localStorage.getItem('isAuthenticated')) {
		loginSection.style.display = 'none' // Скрываем секцию с логином
		startNowBtn.style.display = 'none' // Скрываем кнопку на главной странице
		profileMain.style.display = 'block' // Показываем основное содержимое страницы
	}

	// Username
	if (savedUsername) {
		headerName.textContent = savedUsername
		profileName.textContent = savedUsername
		favoritesName.textContent = savedUsername
		settingsName.textContent = savedUsername
		mainGreeting.textContent = `Hello, ${savedUsername}!`
	}

	// Email
	// if (savedEmail) {

	// }

	// Coins
	// if (savedCoins) {

	// }

	// Avatar
	if (savedAvatar) {
		mainAvatarImg.src = savedAvatar
		profileAvatarImg.src = savedAvatar
		favoritesAvatarImg.src = savedAvatar
		settingsAvatarImg.src = savedAvatar
		// searchAvatarImg.src = savedAvatar
	}
}

export function logOut() {
	const logoutBtn = document.querySelector('.header-profile__dropdown-item[data-action="logout"]')

	logoutBtn.addEventListener('click', (e) => {
		e.preventDefault()

		localStorage.removeItem('username')
		localStorage.removeItem('email')
		localStorage.removeItem('favoriteCurrency')
		localStorage.removeItem('avatar')

		// Удаляем флаг
		localStorage.removeItem('isAuthenticated')

		// Обновляем UI
		document.querySelector('.hero-starts__button-start').style.display = 'initial'

		location.reload()
	});
}

// Глобальная переменная для хранения данных о коинах
let cachedCoinsData = {}

// Загружаем данные один раз при загрузке страницы
async function loadCoinsData() {
	cachedCoinsData = await fetchMainCoinsData()
}

// Вызываем загрузку данных при старте
loadCoinsData()

export function addCoins() {
	const coins = document.querySelector('.profile__cryptocurrency-coins')

	coins.addEventListener('click', async (e) => {
		if (e.target.tagName !== 'BUTTON') return

		// Ближайшие элементы кнопок
		const closestParentEl = e.target.closest('.profile__cryptocurrency-coin')
		const addBtn = closestParentEl?.querySelector('.add-coin')
		const deleteBtn = closestParentEl?.querySelector('.delete-coin')

		//? Достаём данные коина

		// ID Коина
		const coinId = closestParentEl?.dataset.id

		// Ищем данные для нажатого коина
		const coinData = cachedCoinsData[coinId]

		if (!coinData) {
			console.log(`Не найдены данные для ${coinId}`)
			return
		}

		const coinInfo = {
			symbol: coinData.name,
			name: coinData.symbol,
			price: coinData.quote.USD.price,
			market_cap: coinData.quote.USD.market_cap,
			percent_change_1h: coinData.quote.USD.percent_change_1h,
			percent_change_24h: coinData.quote.USD.percent_change_24h,
			percent_change_7d: coinData.quote.USD.percent_change_7d,
			percent_change_30d: coinData.quote.USD.percent_change_30d,
			percent_change_60d: coinData.quote.USD.percent_change_60d,
			percent_change_90d: coinData.quote.USD.percent_change_90d,
		}

		// Форматируем каждое значение
		Object.keys(coinInfo).forEach(key => {
			console.log(coinInfo[key])
			if (typeof coinInfo[key] === 'number') {
				coinInfo[key] = formatNumber(coinInfo[key])
			}
		})

		const savedCoin = {
			id: coinId,
			icon: closestParentEl?.querySelector('.coin-icon')?.getAttribute('src'),
			...coinInfo
		}

		// Читаем сохранённые коины
		const savedCoins = JSON.parse(localStorage.getItem('coins')) || []

		// При добавлении монеты
		if (e.target === addBtn) {

			if (!savedCoins.some(coin => coin.id === savedCoin.id)) {
				savedCoins.push(savedCoin)
				localStorage.setItem('coins', JSON.stringify(savedCoins))
			}
		}

		// При удалении
		if (e.target === deleteBtn) {
			const updatedCoins = savedCoins.filter(coin => coin.id !== savedCoin.id)
			localStorage.setItem('coins', JSON.stringify(updatedCoins))
		}

		// Обновляем кнопки
		updateButtonState()
	});

	// Восстанавливаем состояние при загрузке страницы
	updateButtonState()
}

// Функция обновления состояния кнопок
function updateButtonState() {
	const savedCoins = JSON.parse(localStorage.getItem('coins')) || []
	const allCoins = document.querySelectorAll('.profile__cryptocurrency-coin')

	allCoins.forEach(coinEl => {
		const coinId = coinEl.dataset.id
		const addBtn = coinEl.querySelector('.add-coin')
		const deleteBtn = coinEl.querySelector('.delete-coin')

		const isSaved = savedCoins.some(coin => coin.id === coinId)

		addBtn.classList.toggle('inactive', isSaved)
		deleteBtn.classList.toggle('active', isSaved)
	})
}

export function toggleAnswer() {
	const questions = document.querySelectorAll('.faq__question')

	questions.forEach((question) => {

		question.addEventListener('click', () => {
			const parent = question.parentElement
			parent.classList.toggle('active')
		});
	})
}

export function coinsFollowing() {
	const continueBtn = document.getElementById('continue')
	const congratulationBlock = document.querySelector('.profile__congrat')
	const followingBtn = document.getElementById('following')
	const savedCoins = JSON.parse(localStorage.getItem('coins') || '[]')

	if (savedCoins.length > 0) {
		continueBtn.style.display = 'none'
	}


	continueBtn.addEventListener('click', () => {
		const savedCoins = JSON.parse(localStorage.getItem('coins') || '[]')


		if (!savedCoins || savedCoins.length === 0) {
			alert('Добавьте коин!')
			return
		}

		congratulationBlock.classList.add('active')

		setTimeout(() => {
			congratulationBlock.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		}, 100)
	});
}

// Открываем больше деталей для каждой монеты
export function toggleCoinDetails() {

	const coinsContainer = document.querySelector('.favorites__coins')

	coinsContainer.addEventListener('click', (e) => {
		if (e.target.tagName !== 'BUTTON') return

		const closestCoinParentEl = e.target.closest('.favorites__coin')
		if (!closestCoinParentEl) return

		const parentCoinInner = closestCoinParentEl.closest('.favorites__coin-inner')
		const closestConverterParentEl = parentCoinInner.querySelector('.favorites__coin-converter')
		const moreDetailsBtn = closestCoinParentEl?.querySelector('.favorites__more-details-btn')
		const detailsCont = closestCoinParentEl?.querySelector('.favorites__details')


		if (e.target === moreDetailsBtn) {
			if (detailsCont.classList.contains('active')) {
				// Если детали открыты, то скрываем конвертер, потом детали
				closestConverterParentEl.classList.remove('visible')

				setTimeout(() => {
					detailsCont.classList.remove('active')
					closestCoinParentEl.classList.remove('height')
				}, 300)

				setTimeout(() => {
					closestCoinParentEl.classList.remove('active')
				}, 800)
			} else {
				// Если закрыты, то сначала открываем детали, потом конвертер
				closestCoinParentEl.classList.add('active')

				setTimeout(() => {
					detailsCont.classList.add('active')
					closestCoinParentEl.classList.add('height')
				}, 500)

				setTimeout(() => {
					closestConverterParentEl.classList.add('visible')
				}, 900)
			}
		}
	});
}

export function initFavoritesCurrencyConverter() {
	const converterCnt = document.querySelector('.favorites__coins');


	converterCnt.addEventListener('input', (e) => {
		if (e.target.tagName !== 'INPUT') return;

		const closestParentEl = e.target.closest('.favorites__coin-converter');
		if (!closestParentEl) return;

		const buyInput = closestParentEl.querySelector('.favorites__coin-converter-buy-input');
		const spendInput = closestParentEl.querySelector('.favorites__coin-converter-spend-input');

		const coinPriceEl = closestParentEl.querySelector('.coin-price')?.textContent;

		if (!coinPriceEl) return;

		// Убираем запятые и приводим к числу
		const coinPrice = parseFloat(coinPriceEl.replace(/,/g, ''));

		if (e.target === buyInput) {
			let buyInputValue = parseFloat(e.target.value) || 0;
			console.log('buyInputValue:', buyInputValue);

			spendInput.value = buyInputValue * coinPrice;
		}

		if (e.target === spendInput) {
			let spendInputValue = parseFloat(e.target.value) || 0
			console.log('spendInputValue:', spendInputValue)

			buyInput.innerHTML = ''
			buyInput.value = (spendInputValue / coinPrice).toFixed(6)
		}
	});
}

// Показ всплывающий подсказок 
function showNotification(message, type) {
	// Контейнер для уведомлений
	const notificationContainer = document.getElementById('notification-container')

	// Создаём элемент для уведомлений
	let notification = document.createElement('div')
	notification.className = `notification ${type}`
	notification.textContent = message

	// Кнопка закрытия
	const closeBtn = document.createElement('button')
	closeBtn.className = 'notification-close'
	closeBtn.addEventListener('click', () => notification.remove())

	// Добавляем кнопку закрытия
	notification.append(closeBtn)
	notificationContainer.append(notification)

	// Удаляем через 5 секунд
	setTimeout(() => notification.remove(), 5000)
}
import { formatNumber } from './utils.js';
import { AMOUNT_MAX_LENGTH } from './constatns.js';

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

// ДД меню при клике на профиль
export function initProfileMenu() {
	const profileBtn = document.querySelector('.header-profile')
	const profileMenu = document.querySelector('.header-profile__dropdown')

	profileBtn.addEventListener('click', (e) => {
		e.stopPropagation()
		profileMenu.classList.toggle('visible')
	});

	profileMenu.querySelectorAll('button').forEach(item => {
		item.addEventListener('click', () => {
			profileMenu.classList.remove('visible')
		});
	})

	document.addEventListener('click', (e) => {
		if (!profileMenu.contains(e.target)) {
			profileMenu.classList.remove('visible')
		}
	})
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

// Изменяем URL при клике на My Profile
export function handleProfileClick() {
	const myProfileLink = document.querySelector('.header-profile__dropdown-item[data-action="profile"]')

	myProfileLink.addEventListener('click', (e) => {
		e.preventDefault()

		window.history.pushState({ page: 'profile' }, 'Profile', '/profile')

		switchPage('profile')
	});
}

export function handlePopstate(event) {
	const page = event.state ? event.state.page : window.location.pathname.slice(1) || 'main'
	switchPage(page)
}

// Функция для переключения страниц
export function switchPage(page) {
	// Получаем элементы для профиля и основного контента
	const profile = document.querySelector('.profile')
	const mainPages = document.querySelectorAll('.page:not(.profile)')

	// Удаляем все классы "active" с элементов
	document.querySelectorAll('.page').forEach(section => section.classList.remove('active'))

	// Если это профиль, показываем его, иначе показываем основной контент
	if (page === 'profile') {
		profile.classList.add('active')
	} else {
		mainPages.forEach(section => section.classList.add('active'))
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
	}git


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
	const profileName = document.querySelector('.profile__header-username') // Имя в шапке
	const mainGreeting = document.getElementById('mainGreeting') // Главное приветствие
	const avatarHeaderImg = document.getElementById('avatarMain') // Аватарка в шапке профиля
	const avatarMainHeaderImg = document.getElementById('profileImg') // Аватарка в шапке на гланвной странице
	const loginSection = document.querySelector('.profile__login') // Секция "Log In"
	const profileMain = document.querySelector('.profile__main-content') // Скрытая часть профиля
	const modal = document.querySelector('.profile__auth-modal')

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
			mainGreeting.textContent = `Hello, ${username}!`
			if (avatar) {
				avatarHeaderImg.src = avatar
				avatarMainHeaderImg.src = avatar
			}
			loginSection.style.display = 'none' // Скрываем секцию с логином
			profileMain.style.display = 'block' // Показываем основное содержимое страницы
			modal.classList.remove('profile__auth-modal-acitve')

			// Скрываем загрузку
			loading.style.display = 'none'
		}, 1500)
	});
}

// Загрузка сохранённых данных
export function loadDataProfile() {
	console.log('...Загружаем данные профиля')


	// Получаем элементы UI
	const profileName = document.querySelector('.profile__header-username')
	const mainGreeting = document.getElementById('mainGreeting')
	const avatarHeaderImg = document.getElementById('avatarMain')
	const avatarMainHeaderImg = document.getElementById('profileImg')
	const loginSection = document.querySelector('.profile__login')
	const profileMain = document.querySelector('.profile__main-content')

	const savedUsername = localStorage.getItem('username')
	const savedAvatar = localStorage.getItem('avatar')

	console.log('savedUserName:', savedUsername)
	console.log('savedAvatar:', savedAvatar)
	// Username
	if (savedUsername) {
		profileName.textContent = savedUsername
		mainGreeting.textContent = `Hello, ${savedUsername}!`
		loginSection.style.display = 'none' // Скрываем секцию с логином
		profileMain.style.display = 'block' // Показываем основное содержимое страницы
	}

	// Email
	// if (savedEmail) {

	// }

	// Coins
	// if (savedCoins) {

	// }

	// Avatar
	if (savedAvatar) {
		avatarHeaderImg.src = savedAvatar
		avatarMainHeaderImg.src = savedAvatar
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


	});
}
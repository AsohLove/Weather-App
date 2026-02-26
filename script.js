/* global localStorage */
const apiKey = 'e4b41e596be36010c330bda7a6ed4a26' // gitleaks:allow

let currentUnit = 'metric'
let currentCity = null

const cityInput = document.getElementById('city')
const cityButton = document.getElementById('city-btn')
const mapLink = document.getElementById('map-link')
const suggestionsContainer = document.getElementById('suggestions')

const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`
    )

    if (!response.ok) throw new Error('City not found')

    const data = await response.json()

    updateUI(data)
    saveLastCity(city)
    fetchForecastData(city)
    updateMapLink(city)

    currentCity = city
  } catch (error) {
    window.alert(error.message)
    console.error(error)
  }
}

const updateUI = (data) => {
  const dateObj = new Date()
  document.getElementById('date').textContent =
    dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

  document.getElementById('city-name').textContent =
    `${data.name}, ${data.sys.country}`

  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'
  document.getElementById('temperature').textContent =
    `${Math.round(data.main.temp)}${unitSymbol}`

  document.getElementById('description').textContent =
    data.weather[0].description

  document.getElementById('humidity').textContent =
    `Humidity: ${data.main.humidity}%`

  const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph'
  document.getElementById('wind-speed').textContent =
    `Wind Speed: ${data.wind.speed} ${windUnit}`

  const weatherIcon = document.getElementById('weather-icon')
  weatherIcon.src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

  document.getElementById('weather-info').style.display = 'block'

  changeBackground(data.weather[0].main)
}

const fetchForecastData = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${apiKey}`
    )

    const data = await res.json()

    displayForecast(data)
    displayPastForecast(data)

    displayHourlyForecast(data)
  } catch (err) {
    console.error('Forecast error:', err)
  }
}

const displayForecast = (data) => {
  const container = document.getElementById('forecast-container')
  container.innerHTML = ''

  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes('12:00:00')
  )

  dailyData.slice(0, 5).forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })

    const card = document.createElement('div')
    card.className = 'forecast-card'

    card.innerHTML = `
      <p>${date}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
      <p>${Math.round(day.main.temp)}${unitSymbol}</p>
      <p>${day.weather[0].description}</p>
      <p>Humidity: ${day.main.humidity}%</p>
    `

    container.appendChild(card)
  })
}

const displayHourlyForecast = (data) => {
  const container = document.getElementById('hourly-container')
  container.innerHTML = ''

  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'

  data.list.slice(0, 5).forEach(hour => {
    const time = new Date(hour.dt_txt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })

    const card = document.createElement('div')
    card.className = 'hourly-card'

    card.innerHTML = `
      <p>${time}</p>
      <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png" />
      <p>${Math.round(hour.main.temp)}${unitSymbol}</p>
      <p>${hour.weather[0].description}</p>
    `

    container.appendChild(card)
  })
}

cityInput.addEventListener('input', async () => {
  const query = cityInput.value.trim()
  if (!query) {
    suggestionsContainer.innerHTML = ''
    return
  }

  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
  )

  const data = await res.json()
  suggestionsContainer.innerHTML = ''

  data.forEach(location => {
    const div = document.createElement('div')
    div.className = 'suggestion-item'
    div.textContent = `${location.name}, ${location.country}`

    div.addEventListener('click', () => {
      cityInput.value = location.name
      suggestionsContainer.innerHTML = ''
      fetchWeatherData(location.name)
    })

    suggestionsContainer.appendChild(div)
  })
})

cityButton.addEventListener('click', () => {
  const city = cityInput.value.trim()

  if (!city) {
    window.alert('Please enter a city name')
    return
  }

  fetchWeatherData(city)
})

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    cityButton.click()
  }
})

const celsiusBtn = document.getElementById('celsius-btn')
const fahrenheitBtn = document.getElementById('fah-btn')

celsiusBtn.addEventListener('click', () => {
  if (currentUnit !== 'metric') {
    currentUnit = 'metric'
    updateActiveButton()
    fetchWeatherData(currentCity)
  }
})

fahrenheitBtn.addEventListener('click', () => {
  if (currentUnit !== 'imperial') {
    currentUnit = 'imperial'
    updateActiveButton()
    fetchWeatherData(currentCity)
  }
})

function updateActiveButton () {
  celsiusBtn.classList.toggle('active', currentUnit === 'metric')
  fahrenheitBtn.classList.toggle('active', currentUnit === 'imperial')
}

const saveLastCity = (city) => {
  localStorage.setItem('lastSearchCity', city)
}

const loadLastCity = () => {
  const lastCity = localStorage.getItem('lastSearchCity')
  fetchWeatherData(lastCity || 'London')
}

document.addEventListener('DOMContentLoaded', loadLastCity)

const changeBackground = (weather) => {
  document.body.className = ''

  switch (weather) {
    case 'Clear':
      document.body.classList.add('clear')
      break
    case 'Clouds':
      document.body.classList.add('clouds')
      break
    case 'Rain':
      document.body.classList.add('rain')
      break
    case 'Snow':
      document.body.classList.add('snow')
      break
    case 'Thunderstorm':
      document.body.classList.add('thunderstorm')
      break
    default:
      document.body.classList.add('mist')
  }
}

const updateMapLink = (destination) => {
  const baseURL = 'https://www.google.com/maps/search/?api=1'
  const encodedDestination = encodeURIComponent(destination)
  mapLink.href = `${baseURL}&query=${encodedDestination}`
}

const displayPastForecast = (data) => {
  const container = document.getElementById('past-container')
  container.innerHTML = ''

  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes('12:00:00')
  )

  const reversed = dailyData.slice(0, 5).reverse()

  reversed.forEach(day => {
    const card = document.createElement('div')
    card.className = 'forecast-card'

    card.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
      <p>${Math.round(day.main.temp)}${unitSymbol}</p>
      <p>${day.weather[0].description}</p>
      <p>Humidity: ${day.main.humidity}%</p>
    `

    container.appendChild(card)
  })
}

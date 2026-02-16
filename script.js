/* global apiKey */
/* global localStorage */

let currentUnit = 'metric'
let currentCity = null
const cityInput = document.getElementById('city')
const cityButton = document.getElementById('city-btn')

const fetchWeatherData = (city) => {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6&aqi=no`)
    .then(response => {
      if (!response.ok) throw new Error('City not found')
      return response.json()
    })
    .then(data => {
      updateUI(data)
      saveLastCity(data.location.name)
      fetchForecastData(data.location.name)
      fetchPastFiveDays(data.location.name)

      currentCity = data.location.name
    })
    .catch(error => {
      window.alert(error.message)
      console.error(error)
    })
}

const updateUI = (data) => {
  const time = data.location.localtime.split(' ')[0] // "YYYY-MM-DD"
  const dateObj = new Date(time)
  document.getElementById('date').textContent = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  document.getElementById('city-name').textContent = `${data.location.name}, ${data.location.country}`
  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'
  const temperature = currentUnit === 'metric'
    ? data.current.temp_c
    : data.current.temp_f

  document.getElementById('temperature').textContent =
  `Temp: ${temperature}${unitSymbol}`

  document.getElementById('description').textContent = data.current.condition.text
  document.getElementById('humidity').textContent = `Humidity: ${data.current.humidity}%`
  const windSpeed = currentUnit === 'metric'
    ? data.current.wind_kph
    : data.current.wind_mph

  const windUnit = currentUnit === 'metric' ? 'kph' : 'mph'

  document.getElementById('wind-speed').textContent =
  `Wind Speed: ${windSpeed} ${windUnit}`

  const weatherIcon = document.getElementById('weather-icon')
  weatherIcon.src = `https:${data.current.condition.icon}`

  document.getElementById('weather-info').style.display = 'block'

  changeBackground(data.current.condition.text)
}

const saveLastCity = (cityName) => {
  localStorage.setItem('lastSearchCity', cityName)
}

const loadLastCity = () => {
  const lastCity = localStorage.getItem('lastSearchCity')
  if (lastCity) {
    fetchWeatherData(lastCity)
  } else {
    fetchWeatherData('London')
  }
}

cityButton.addEventListener('click', () => {
  const city = cityInput.value.trim()
  if (city) {
    fetchWeatherData(city)
  }
})

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    cityButton.click()
  }
})

document.addEventListener('DOMContentLoaded', loadLastCity)

const fetchForecastData = (city) => {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6&aqi=no`)
    .then(res => res.json())
    .then(data => {
      displayForecast(data)
    })
    .catch(err => console.error('Forecast error:', err))
}

const displayForecast = (data) => {
  const forecastContainer = document.getElementById('forecast-container')
  forecastContainer.innerHTML = ''

  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'

  data.forecast.forecastday.slice(1, 6).forEach(day => {
    const date = new Date(day.date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    const temp = currentUnit === 'metric'
      ? Math.round(day.day.avgtemp_c)
      : Math.round(day.day.avgtemp_f)

    const icon = day.day.condition.icon

    const humidity = day.day.avghumidity

    const windSpeed = currentUnit === 'metric'
      ? day.day.maxwind_kph
      : day.day.maxwind_mph

    const windUnit = currentUnit === 'metric' ? 'kph' : 'mph'

    const card = document.createElement('div')
    card.className = 'forecast-card'

    card.innerHTML = `
      <p>${date}</p>
      <img src="https:${icon}" />
      <p>${temp}${unitSymbol}</p>
      <p>Humidity: ${humidity}</p>
      <p>Wind: ${Math.round(windSpeed)} ${windUnit}</p>
    `

    forecastContainer.appendChild(card)
  })
}

const changeBackground = (weather) => {
  document.body.className = ''

  switch (true) {
    case /Clear/.test(weather):
      document.body.classList.add('clear')
      break
    case /Cloud/.test(weather):
      document.body.classList.add('clouds')
      break
    case /Rain|Drizzle/.test(weather):
      document.body.classList.add('rain')
      break
    case /Snow/.test(weather):
      document.body.classList.add('snow')
      break
    case /Thunder/.test(weather):
      document.body.classList.add('thunderstorm')
      break
    default:
      document.body.classList.add('mist')
  }
}

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

const fetchPastFiveDays = async (city) => {
  const container = document.getElementById('past-container')
  container.innerHTML = ''

  for (let i = 1; i <= 5; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dt = date.toISOString().split('T')[0]

    try {
      const response = await fetch(`https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${dt}`)
      const data = await response.json()
      displayPastWeather(data)
    } catch (err) {
      console.error('Past weather error:', err)
    }
  }
}

const displayPastWeather = (data) => {
  const container = document.getElementById('past-container')
  const day = data.forecast.forecastday[0].day
  const dateStr = data.forecast.forecastday[0].date
  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'
  const temp = currentUnit === 'metric'
    ? Math.round(day.avgtemp_c)
    : Math.round(day.avgtemp_f)

  const windSpeed = currentUnit === 'metric'
    ? day.maxwind_kph
    : day.maxwind_mph

  const windUnit = currentUnit === 'metric' ? 'kph' : 'mph'

  const card = document.createElement('div')
  card.className = 'forecast-card'

  card.innerHTML = `
    <p>${dateStr}</p>
    <img src="https:${day.condition.icon}" />
    <p>${temp}${unitSymbol}</p>
    <p>${day.condition.text}</p>
    <p>Humidity: ${day.avghumidity}%</p>
    <p>Wind: ${Math.round(windSpeed)} ${windUnit}</p>
  `

  container.appendChild(card)
}

const suggestionsContainer = document.getElementById('suggestions')
let selectedCity = null

cityInput.addEventListener('input', () => {
  selectedCity = null
  const query = cityInput.value.trim()
  if (!query) {
    suggestionsContainer.innerHTML = ''
    return
  }

  fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`)
    .then(res => res.json())
    .then(data => {
      suggestionsContainer.innerHTML = ''

      data.forEach(location => {
        const div = document.createElement('div')
        div.className = 'suggestion-item'
        div.textContent = `${location.name}, ${location.country}`

        div.addEventListener('click', () => {
          cityInput.value = `${location.name}, ${location.country}`
          selectedCity = location.name
          suggestionsContainer.innerHTML = ''
          fetchWeatherData(location.name)
        })

        suggestionsContainer.appendChild(div)
      })
    })
    .catch(err => console.error('Autocomplete error:', err))
})

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    const city = cityInput.value.trim()
    if (!city) {
      window.alert('Please enter a city name')
      return
    }
    fetchWeatherData(city)
    suggestionsContainer.innerHTML = ''
  }
})

document.addEventListener('click', (e) => {
  if (e.target !== cityInput) {
    suggestionsContainer.innerHTML = ''
  }
})

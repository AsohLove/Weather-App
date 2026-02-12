/* global apiKey */
/* global localStorage */

let currentUnit = 'metric'
let currentCity = null
const cityInput = document.getElementById('city')
const cityButton = document.getElementById('city-btn')

const fetchWeatherData = (city) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`)
    .then(response => {
      if (!response.ok) throw new Error('City not found')
      return response.json()
    })
    .then(data => {
      updateUI(data)
      saveLastCity(data.name)
      fetchForecastData(data.name)
      currentCity = data.name
    })
    .catch(error => {
      window.alert(error.message)
      console.error(error)
    })
}

const updateUI = (data) => {
  const time = data.dt
  const date = new Date(time * 1000)

  document.getElementById('date').textContent = date.toDateString()
  document.getElementById('city-name').textContent = data.name + ' ' + data.sys.country
  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'
  document.getElementById('temperature').textContent = `Temp: ${data.main.temp}${unitSymbol}`
  document.getElementById('description').textContent = data.weather[0].description
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`
  document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`

  const weatherIcon = document.getElementById('weather-icon')
  const iconCode = data.weather[0].icon
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  document.getElementById('weather-info').style.display = 'block'

  changeBackground(data.weather[0].main)
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
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`
  )
    .then(res => res.json())
    .then(data => {
      displayForecast(data)
    })
    .catch(err => console.error('Forecast error:', err))
}

const displayForecast = (data) => {
  const forecastContainer =
    document.getElementById('forecast-container')
  forecastContainer.innerHTML = ''

  const dailyForecasts = data.list.filter((item, index) => index % 8 === 0)

  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'

  dailyForecasts.forEach((item, i) => {
    if (i >= 5) return

    const date = new Date(item.dt_txt).toLocaleDateString('en-US', {
      weekday: 'short'
    })

    const temp = Math.round(item.main.temp)
    const icon = item.weather[0].icon

    const card = document.createElement('div')
    card.className = 'forecast-card'

    card.innerHTML = `
      <p>${date}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png" />
      <p>${temp}${unitSymbol}</p>
    `

    forecastContainer.appendChild(card)
  })
}

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
    case 'Drizzle':
      document.body.classList.add('rain')
      break
    case 'Snow':
      document.body.classList.add('snow')
      break
    case 'Thunderstorm':
      document.body.classList.add('thunderstorm')
      break
    case 'Mist':
    case 'Haze':
    case 'Fog':
      document.body.classList.add('mist')
      break
    default:
      document.body.classList.add('clear')
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

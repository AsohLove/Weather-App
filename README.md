# :sun_behind_small_cloud: WEATHER APP

## :beginner: Overview
A  weather application that displays current weather conditions and a 5‑day forecast for any city, built with JavaScript.

### :file_folder: Project Structure

```text
|
|--- .github/
| |--- workflows/
|    |--- linters.yml # Contains the linters code for checking code errors
|
|--- index.html # The main HTML file containing the page structure
|
|--- script.js # contains the JavaScript implementation of the app
|
|--- style.css # All CSS styling
|
|--- config.local.js # Hide the API key
|
|---README.md # Project overview and documentation
|
```

### :star: Tech Stack
- HTML
- CSS
- JavaScript
- OpenWeatherMap API

### :sparkles: Features

- :earth_africa: Search weather by city name

- :thermometer: City, current temperature,, humidity, and wind speed

- :calendar: 5‑day weather forecast

- :art: Dynamic background based on weather conditions

- :floppy_disk: Remembers last searched city using localStorage

- :closed_lock_with_key: API key securely stored on the server (never exposed to the browser)




### :electric_plug: How to run this project
1) Clone the repository [here](git@github.com:AsohLove/Weather-App.git)
2) Open index.html in a browser



**Code snippet**

```JavaScript
    
    const updateUI = (data) => {
  document.getElementById('city-name').textContent = data.name
  document.getElementById('temperature').textContent = `${data.main.temp}°C`
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
 
```

* :rocket: [Deployed page](https://asohlove.github.io/Weather-App/)



:technologist: **Love Asoh**

- GitHub: [@loveasoh](https://github.com/AsohLove)
- Twitter: [@loveasoh](https://x.com/LoveTheModifier)
- LinkedIn: [@love asoh](https://www.linkedin.com/in/asohlove/)

## :lock: License
This project is [MIT](./LICENSE) licensed.
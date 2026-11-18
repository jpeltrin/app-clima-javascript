const urlBase = `https://api.openweathermap.org/data/2.5/weather`
const API_KEY = 'fbe3dfd40cb2e81f3dea3dc4b84fb09b'

const cityInput = document.getElementById('cityInput')
const searchButton = document.getElementById('searchButton')
const divResponseData = document.getElementById('responseData')

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim()
    if (city) {
        fetchWeather(city)
    } else {
        showMessage('Ingrese una ciudad válida')
    }
})

// Buscar también al apretar Enter
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchButton.click()
})

function fetchWeather(city) {
    showMessage('Cargando...')

    // units=metric devuelve la temperatura directamente en °C
    fetch(`${urlBase}?q=${city}&appid=${API_KEY}&lang=es&units=metric`)
        .then(response => response.json())
        .then(data => showWeatherData(data))
        .catch(() => showMessage('Error de conexión. Intente nuevamente.'))
}

function showMessage(text) {
    divResponseData.innerHTML = ''
    const message = document.createElement('p')
    message.className = 'message'
    message.textContent = text
    divResponseData.appendChild(message)
}

function showWeatherData(data) {
    if (data.cod != 200) {
        showMessage('Ciudad no encontrada')
        return
    }

    divResponseData.innerHTML = ''

    const cityName = data.name
    const countryName = data.sys.country
    const temp = data.main.temp
    const feelsLike = data.main.feels_like
    const humidity = data.main.humidity
    const wind = data.wind.speed
    const description = data.weather[0].description
    const icon = data.weather[0].icon

    const cityInfo = document.createElement('h2')
    cityInfo.textContent = `${cityName}, ${countryName}`

    const iconInfo = document.createElement('img')
    iconInfo.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
    iconInfo.alt = description

    const tempInfo = document.createElement('p')
    tempInfo.className = 'temp'
    tempInfo.textContent = `${Math.round(temp)}°C`

    const descriptionInfo = document.createElement('p')
    descriptionInfo.className = 'description'
    descriptionInfo.textContent = description

    const details = document.createElement('div')
    details.className = 'details'

    const feelsInfo = document.createElement('span')
    feelsInfo.textContent = `🌡️ Sensación ${Math.round(feelsLike)}°C`

    const humidityInfo = document.createElement('span')
    humidityInfo.textContent = `💧 ${humidity}%`

    // La API devuelve el viento en m/s; se pasa a km/h
    const windInfo = document.createElement('span')
    windInfo.textContent = `💨 ${Math.round(wind * 3.6)} km/h`

    details.appendChild(feelsInfo)
    details.appendChild(humidityInfo)
    details.appendChild(windInfo)

    divResponseData.appendChild(cityInfo)
    divResponseData.appendChild(iconInfo)
    divResponseData.appendChild(tempInfo)
    divResponseData.appendChild(descriptionInfo)
    divResponseData.appendChild(details)

    changeBackground(icon)
}

// Cambia el fondo según el código del ícono (01 = despejado, 02-04 = nubes, etc.)
function changeBackground(icon) {
    const code = icon.slice(0, 2)
    const types = {
        '01': 'despejado',
        '02': 'nublado',
        '03': 'nublado',
        '04': 'nublado',
        '09': 'lluvia',
        '10': 'lluvia',
        '11': 'tormenta',
        '13': 'nieve',
        '50': 'niebla'
    }
    document.body.className = types[code] || ''
}

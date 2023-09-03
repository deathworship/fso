import { useState, useEffect } from "react"
import countries from "./services/countries"
import weather from "./services/weather"
import { WeatherDescription } from "./weathercodes"

const App = () => {
  const [ countryNames, setCountryNames ] = useState(null)
  const [ foundCountryNames, setFoundCountryNames ] = useState(null)
  const [ countryToShow, setCountryToShow] = useState(null)
  const [ countryData, setCountryData ] = useState(null)
  const [ weatherData, setWeatherData ] = useState(null)

  useEffect(() => {
    countries
    .getAll()
    .then(data => {
      const names = data.map(data => data.name.common)
      setCountryNames(names)
    })
  }, [])

  useEffect(() => {
    if (countryToShow) {
      countries
      .getCountry(countryToShow)
      .then(data => {
        setCountryData(data)
      })
    }
  }, [countryToShow])

  useEffect(() => {
    if (countryData) {
      const latlong = countryData.capitalInfo.latlng
      weather
      .getWeather(latlong[0], latlong[1])
      .then(data => {
        setWeatherData(data)
      })
    }
  }, [countryData])

  const handleInputChange = (event) => {
    const search = event.target.value
    if (search === '') {
      setCountryToShow(null)
      setFoundCountryNames(null)
      return
    }
    if (countryNames) {
      const found = countryNames.filter(country => country.search(new RegExp(search, "i")) != -1)
      if (found.length === 1) {
        setCountryToShow(found[0])
      }
      else {
        setCountryToShow(null)
        setFoundCountryNames(found)
      }
    }
  }

  const handleShowSelected = (event) => {
    setCountryToShow(event)
  }

  return (
    <div>
      find countries <input onChange={handleInputChange} />
      <Display foundCountryNames={ foundCountryNames } countryToShow={countryToShow} countryData={countryData} weatherData={weatherData} onShowSelected={handleShowSelected} />
    </div>
  )
}

const Display = ({ foundCountryNames, countryToShow, countryData, weatherData, onShowSelected }) => {
  if (countryToShow && countryData && weatherData) {
    return (
      <div>
        <CountryInfo countryData={countryData} />
        <WeatherInfo weatherData={weatherData} />
      </div>
    )
  }
  if (foundCountryNames) {
    if (foundCountryNames.length <= 10) {
      return (
        <CountryList countries = {foundCountryNames} onShowSelected={onShowSelected} />
      )
    }
    else {
      return (
        <div>
          Too many matches, specify another filter
        </div>
      )
    }
  }
  else return null
}

const CountryList = ({ countries, onShowSelected }) => {
  return (
    <div>
    {countries.map(country => 
      <div key={countries.indexOf(country)}>
        {country}
        <button onClick={() => onShowSelected(country)}>show</button>
      </div>
    )}
    </div>
  )
}

const CountryInfo = ({ countryData }) => {
  const name = countryData.name.common
  const capital = countryData.capital
  const area = countryData.area
  const languages = Object.values(countryData.languages)
  const flagUrl = countryData.flags.png
  const flagAlt = countryData.flags.alt
  return (
    <div>
      <h1>{name}</h1>
      capital {capital}
      <br />
      area {area}
      <h3>languages:</h3>
      <ul>
        {languages.map(language => 
          <li key={languages.indexOf(language)}>
            {language}
          </li>
        )}
      </ul>
      <img src={flagUrl} alt={flagAlt} />
    </div>
  )
}

const WeatherInfo = ({ weatherData }) => {
  const capital = weatherData.timezone.match(/\/(.+)/)[1].replaceAll('_', ' ')
  const temperature = weatherData.current_weather.temperature
  const windspeed = weatherData.current_weather.windspeed
  const weathercode = weatherData.current_weather.weathercode
  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {temperature} celsius</p>
      <p>wind {windspeed} m/s</p>
      <p><b>{WeatherDescription[weathercode]}</b></p>
      <a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a>
    </div>
  )
}

export default App

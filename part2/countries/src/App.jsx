import { useState, useEffect } from "react"
import countries from "./services/countries"

const App = () => {
  const [ countryNames, setCountryNames ] = useState(null)
  const [ foundCountryNames, setFoundCountryNames ] = useState(null)
  const [ countryToShow, setCountryToShow] = useState(null)
  const [ countryData, setCountryData ] = useState(null)

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

  const handleInputChange = (event) => {
    const search = event.target.value
    if (search === '') {
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
      <Display foundCountryNames={ foundCountryNames } countryData={countryData} countryToShow={countryToShow} onShowSelected={handleShowSelected} />
    </div>
  )
}

const Display = ({ foundCountryNames, countryData, countryToShow, onShowSelected }) => {
  if (countryToShow) {
    return (
      <CountryInfo countryData={countryData} />
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

export default App

import React, { useState, useEffect } from 'react'

const api_key = process.env.REACT_APP_API_KEY

const Input = ({ label, value, onChange }) => {
  return (
    <div>
      {label} <input value={value} onChange={onChange} />
    </div>
  )
}

const Country = ({ name, capital, population, languages, flag }) => {
  const [weather, setWeather] = useState()

  useEffect(() => {
    fetch(
      `http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`
    )
      .then(response => response.json())
      .then(data => {
        setWeather(data.current)
      })
  }, [capital])

  return (
    <div>
      <h2>{name}</h2>
      <p>
        capital {capital}
        <br />
        population {population}
      </p>
      <h3>Spoken languages</h3>
      <ul>
        {languages.map(language => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <img src={flag} alt={name} height="100"></img>

      <h3>Weather in {capital}</h3>
      {weather ? (
        <p>
          <b>temperature: </b>
          {weather.temperature} Celsius
          <br />
          <img
            src={weather.weather_icons[0]}
            alt={weather.weather_descriptions[0]}
            height="75"
          ></img>
          <br />
          <b>wind: </b>
          {weather.wind_speed} mph direction {weather.wind_dir}
        </p>
      ) : (
        <p></p>
      )}
    </div>
  )
}

const Countries = ({ countries, onClick }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countries.length === 1) {
    return <Country {...countries[0]} />
  } else {
    return (
      <>
        {countries.map(country => (
          <p key={country.name}>
            {country.name}
            <button onClick={() => onClick(country.name)}>show</button>
          </p>
        ))}
      </>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')

  const handleSearchChange = event => {
    setNewSearch(event.target.value)
  }

  const handleSelect = search => {
    setNewSearch(search)
  }

  const countriesToShow = countries.filter(country =>
    country.name.toLowerCase().includes(newSearch.toLowerCase())
  )

  useEffect(() => {
    fetch('https://restcountries.eu/rest/v2/all')
      .then(response => response.json())
      .then(data => {
        setCountries(data)
      })
  }, [])

  return (
    <div>
      <Input
        label={'find countries'}
        value={newSearch}
        onChange={handleSearchChange}
      />

      <Countries countries={countriesToShow} onClick={handleSelect} />
    </div>
  )
}

export default App

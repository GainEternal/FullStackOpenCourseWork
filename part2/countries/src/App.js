import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Filter from './components/Filter'

const api_key = process.env.REACT_APP_API_KEY
// variable api_key has now the value set in startup

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterText, setFilterText] = useState('')
  const [weather, setWeather] = useState({})
  const [api_url, setApi_url] = useState(
    `https://api.openweathermap.org/data/2.5/weather?q=Washington+DC&units=metric&appid=${api_key}`
    )


  useEffect(() => {
    if (!countries.length) {
      axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(countries.concat(response.data))
      })
    }
  }, [])

  useEffect(() => {
    axios
    .get(api_url)
    .then(response => {
      setWeather(response.data)
    })
  }, [api_url])

  const changeFilterText = (newFilter) => {
    const filteredCountries = countries.filter((country) => 
      country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
    if (filteredCountries.length === 1) {
      const cityName = filteredCountries[0].capital[0]
      const countryCode = filteredCountries[0].name.common
      const new_url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&units=metric&appid=${api_key}`
      setApi_url(new_url)
    }
    setFilterText(newFilter)
  }

  const handleFilterChange = (event) => {
    changeFilterText(event.target.value)
  }

  const handleShow = (event) => {
    event.preventDefault()
    changeFilterText(event.target.id)
  }

  return (
    <div>
      <h1>Country Data</h1>
      <div>
        <Filter filterText={filterText} handleFilter={handleFilterChange}/>
      </div>
      --------------------------------------------------------
      <br></br>
      <div>
        <Countries 
          countries={countries} 
          filter={filterText}
          handleButton={handleShow}
          weather={weather}/>
      </div>
    </div>
  )
}

export default App
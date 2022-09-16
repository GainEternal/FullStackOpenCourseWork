import { useState, useEffect } from 'react'
import axios from 'axios'
/* 
import Filter from "./components/Filter"
import NewContact from "./components/NewContact"
import Persons from "./components/Persons" */

const Filter = ({ filterText, handleFilter }) => 
  <div>
    Find Countries:
    <input value={filterText} onChange={handleFilter} />
  </div>

const Countries = ({ countries, filter }) => {
  /* if (filter === '') {
    return <ul>
      {countries
        .map((country) => <Country key={country.name.common} country={country.name.common}/>)
      }
    </ul>
  } */

  const filteredCountries = countries.filter((country) => 
    country.name.common.toLowerCase().includes(filter.toLowerCase()))

  if (filteredCountries.length > 10) {
    return <div>Too many matches. Specify another filter.</div>
  } else if (filteredCountries.length > 1) {
    return <ul>
      {filteredCountries
        .map((country) => <Country key={country.name.common} country={country.name.common}/>)
      }
    </ul>
  } else if(filteredCountries.length === 1) {
    return (
      <div>
        <h2>{filteredCountries[0].name.common}</h2>
        <div>
          Region: {filteredCountries[0].region}<br/>
          Capital: {filteredCountries[0].capital}<br/>
          Area: {filteredCountries[0].area} km<sup>2</sup><br/>
          Population: {filteredCountries[0].population}<br/>

          <h3>Languages</h3>
          <ul>
            {Object.values(filteredCountries[0].languages)
              .map((language) => <Language key={language} language={language}/>)
            }
          </ul>

          <img src={filteredCountries[0].flags.png} alt="Country Flag" />

        </div>
      </div>
    )
  } else {
    return <div>
      No countries match
    </div>
  }
}

const Country = ({ country }) => <li>{country}</li>
const Language = ({ language }) => <li>{language}</li>

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterText, setFilterText] = useState('')
  const [onlyOne, setOnlyOne] = useState(false)

  useEffect(() => {
    if (!countries.length) {
      axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(countries.concat(response.data))
      })
    }
  }, [])


  const handleFilterChange = (event) => {
    setFilterText(event.target.value)

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
        <Countries countries={countries} filter={filterText}/>
      </div>

      {/* <h1>Phonebook</h1>

      <Filter filterText={filterText} handleFilter={handleFilterChange} />

      <h2>Add New Contact</h2>
      <NewContact 
        newName={newName}
        handleName={handleNameChange}
        newNumber={newNumber}
        handleNumber={handleNumberChange}
        handleButton={addContact}
      />

      <h2>Contacts</h2>
      <Persons persons={persons} filter={filterText} /> */}
    </div>
  )
}

export default App
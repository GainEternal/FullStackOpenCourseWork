import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Filter from './components/Filter'


const App = () => {
  const [countries, setCountries] = useState([])
  const [filterText, setFilterText] = useState('')
  const [oneCountry, setOneCountry] = useState(false)

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

  const handleShow = (event) => {
    event.preventDefault()
    console.log(event.target);
    setFilterText(event.target.id)
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
          oneCountry={oneCountry}
          handleButton={handleShow}/>
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
import { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from "./components/Filter"
import NewContact from "./components/NewContact"
import Persons from "./components/Persons"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(persons.concat(response.data))
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterText(event.target.value)

  }

  const addContact = (event) => {
    event.preventDefault()
    const newContact = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    const isDuplicate = persons.some((current) =>
      current.name === newName
    )

    if (isDuplicate) {
      alert(`"${newName}" has already been added`)
    } else {
      setPersons(persons.concat(newContact))
      setNewName('')
      setNewNumber('')
    }
  }


  return (
    <div>
      <h1>Phonebook</h1>

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
      <Persons persons={persons} filter={filterText} />
    </div>
  )
}

export default App
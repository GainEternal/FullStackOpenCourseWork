import { useState } from 'react'

import Filter from "./components/Filter"
import NewContact from "./components/NewContact"
import Persons from "./components/Persons"

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '51-48-3938', id: 1},
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

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
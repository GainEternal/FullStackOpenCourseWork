import { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from "./components/Filter"
import NewContact from "./components/NewContact"
import Persons from "./components/Persons"
import personService from "./services/persons"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    if (!persons.length) {
      personService
        .getAll()
        .then(initialContacts => {
          setPersons(persons.concat(initialContacts))
        })
    }
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

  const deletePersonOf = (id) => {
    const name = persons.find(person => person.id === id).name
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(returned => {
          setPersons(persons.filter(person => person.id != id ))
        })
    }    
  }

  const addContact = (event) => {
    event.preventDefault()

    const isDuplicate = persons.some((current) =>
        current.name === newName
      )

    if (isDuplicate) {
      const confirmString = 
          `${newName} is already added to phonebook. \nReplace the older number with a new one?`
      if (window.confirm(confirmString)) {
        const modContact = {
          ...persons.find(person => person.name === newName),
          number: newNumber
        }
        personService
          .modify(modContact)
          .then(returnedPerson => {
            setPersons(persons.map(person => 
              person.name === returnedPerson.name
              ? { ...person, number: returnedPerson.number}
              : person
              ))
            setNewName('')
            setNewNumber('')
          })
      }
    } else {
    const newContact = {
      name: newName,
      number: newNumber
    }
      personService
        .create(newContact)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
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
      <Persons 
        persons={persons} 
        filter={filterText} 
        deletePersonOf = {deletePersonOf}
      />
    </div>
  )
}

export default App
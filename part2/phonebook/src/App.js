import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import NewContact from './components/NewContact'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [notifyMessage, setConfirmMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    if (!persons.length) {
      personService.getAll().then((initialContacts) => {
        setPersons(persons.concat(initialContacts))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const name = persons.find((person) => person.id === id).name
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then((returned) => {
        setPersons(persons.filter((person) => person.id !== id))
      })
    }
  }

  const modifyContactNumber = () => {
    const modContact = {
      ...persons.find((person) => person.name === newName),
      number: newNumber,
    }
    personService
      .modify(modContact)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) =>
            person.name === returnedPerson.name
              ? { ...person, number: returnedPerson.number }
              : person,
          ),
        )
        setNewName('')
        setNewNumber('')
        displayMessage(`Modified ${returnedPerson.name}`, '')
      })
      .catch((error) => {
        if ('error' in error.response.data) {
          displayMessage(error.response.data.error, 'error')
        } else {
          displayMessage(
            `Information of ${newName} has already been removed from server`,
            'error',
          )
        }
      })
  }

  const createContact = () => {
    const newContact = {
      name: newName,
      number: newNumber,
    }
    personService
      .create(newContact)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')

        displayMessage(`Added ${returnedPerson.name}`, '')
      })
      .catch((error) => {
        console.log(error)
        console.log(error.response.data.error)
        displayMessage(error.response.data.error, 'error')
      })
  }

  const displayMessage = (message, type) => {
    setConfirmMessage(message)
    setMessageType(type)
    setTimeout(() => {
      setConfirmMessage(null)
    }, 5000)
  }

  const addContact = (event) => {
    event.preventDefault()

    if (contactAlreadyExists()) {
      const confirmString = `${newName} is already added to phonebook. \nReplace the older number with a new one?`
      if (window.confirm(confirmString)) {
        modifyContactNumber()
      }
    } else {
      createContact()
    }
  }

  const contactAlreadyExists = () => {
    return persons.some((current) => current.name === newName)
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filterText.toLowerCase()),
  )

  return (
    <>
      <div className="jumbotron text-center">
        <h1>Phonebook</h1>
      </div>
      <div className="container-fluid">
        <Notification message={notifyMessage} type={messageType} />
      </div>

      <div className="container-fluid">
        <h2>Add New Contact</h2>
        <NewContact
          newName={newName}
          handleName={handleNameChange}
          newNumber={newNumber}
          handleNumber={handleNumberChange}
          handleButton={addContact}
        />
      </div>

      <div className="container-fluid">
        <h2>Contacts</h2>
        <Filter filterText={filterText} handleFilter={handleFilterChange} />
        <Persons persons={personsToShow} deletePersonOf={deletePersonOf} />
      </div>
    </>
  )
}

export default App

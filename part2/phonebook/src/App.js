import { useState } from 'react'

const Person = ({ person }) => <li>{person.name}: {person.number}</li>


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number: '51-48-3938'
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addContact = (event) => {
    event.preventDefault()
    const newContact = { 
      name: newName,
      number: newNumber
    }

    /* const isDuplicate = persons.some(( current ) => 
      JSON.stringify( current ) === JSON.stringify( newPerson )
      ) */

    const isDuplicate = persons.some(( current ) => 
      current.name === newName
      )

    if (isDuplicate) {
      alert(`"${newName}" has already been added`)
    } else {
      setPersons(persons.concat( newContact ))
      setNewName('')
      setNewNumber('')
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          Name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button onClick={addContact} type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => 
          <Person key={person.name} person={person} />
        )}
      </ul>
    </div>
  )
}

export default App
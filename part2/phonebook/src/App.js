import { useState } from 'react'

const Person = ({ person }) => <li>{person.name}</li>


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const newPerson = { name: newName }

    const isDuplicate = persons.some(( current ) => 
      JSON.stringify( current ) === JSON.stringify( newPerson )
      )

    if (isDuplicate) {
      alert(`"${newName}" has already been added`)
    } else {
      setPersons(persons.concat( newPerson ))
      setNewName('')
    }
  }
  

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button onClick={addName} type="submit">add</button>
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
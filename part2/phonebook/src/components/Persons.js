const Persons = ({ persons, filter, deletePersonOf }) => 
  <div>
    <ul>
      {persons
        .filter((person) => person.name.toLowerCase().includes(filter))
        .map((person) => <Person 
          key={person.id} 
          person={person}
          deletePerson={() => deletePersonOf(person.id)}
        />
      )}
    </ul>
  </div>

const Person = ({ person, deletePerson }) => {
  return (
    <li>
      {person.name}: {person.number}
      <button id={person.name} onClick={deletePerson}>delete</button>
    </li>
  )
}

export default Persons
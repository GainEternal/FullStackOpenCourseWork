const Persons = ({ persons, filter }) => 
  <div>
    <ul>
      {persons
        .filter((person) => person.name.toLowerCase().includes(filter))
        .map((person) => <Person key={person.id} person={person} />
        )}
    </ul>
  </div>

const Person = ({ person }) => <li>{person.name}: {person.number}</li>

export default Persons
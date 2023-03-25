const Persons = ({ persons, deletePersonOf }) => (
  <div>
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Number</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {persons.map((person) => (
          <Person
            key={person.id}
            person={person}
            deletePerson={() => deletePersonOf(person.id)}
          />
        ))}
      </tbody>
    </table>
  </div>
)

const Person = ({ person, deletePerson }) => {
  return (
    <tr>
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td>
        <button
          className="btn btn-danger"
          id={person.name}
          onClick={deletePerson}
        >
          delete
        </button>
      </td>
    </tr>
  )
}

export default Persons

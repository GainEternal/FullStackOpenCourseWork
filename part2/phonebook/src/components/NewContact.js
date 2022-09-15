const NewContact = (props) =>
  <form>
    <div>
      Name: <input value={props.newName} onChange={props.handleName} />
    </div>
    <div>
      Number: <input value={props.newNumber} onChange={props.handleNumber} />
    </div>
    <div>
      <button onClick={props.handleButton} type="submit">add</button>
    </div>
  </form>

export default NewContact
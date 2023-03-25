const NewContact = (props) => (
  <form>
    <div className="form-group">
      <label>
        <strong>Name: </strong>
      </label>
      <input
        className="form-control"
        placeholder="Enter Name"
        value={props.newName}
        onChange={props.handleName}
      />
    </div>
    <div className="form-group">
      <label>
        <strong>Number: </strong>
      </label>
      <input
        className="form-control"
        placeholder="Enter Number"
        value={props.newNumber}
        onChange={props.handleNumber}
      />
    </div>
    <div>
      <button
        className="btn btn-primary"
        onClick={props.handleButton}
        type="submit"
      >
        add
      </button>
    </div>
  </form>
)

export default NewContact

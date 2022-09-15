const Filter = ({ filterText, handleFilter }) => 
  <div>
    Filter phonebook with:
    <input value={filterText} onChange={handleFilter} />
  </div>


export default Filter
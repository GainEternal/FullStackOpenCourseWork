const Filter = ({ filterText, handleFilter }) => 
  <div>
    Find Countries:
    <input value={filterText} onChange={handleFilter} />
  </div>

export default Filter
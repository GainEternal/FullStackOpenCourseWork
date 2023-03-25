const Filter = ({ filterText, handleFilter }) => (
  <>
    <strong>Filter phonebook by:</strong>
    <div>
      <input value={filterText} onChange={handleFilter} />
    </div>
  </>
)

export default Filter

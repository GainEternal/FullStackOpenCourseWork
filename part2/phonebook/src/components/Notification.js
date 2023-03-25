const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  let className = 'alert alert-success'

  if (type === 'error') {
    className = 'alert alert-danger'
  }

  return <div className={`notification ${className}`}>{message}</div>
}

export default Notification

const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }

    let className = 'confirm'

    if (type === 'error') {
        className = 'error'
    }
    
    return (
        <div className={`notification ${className}`}>
            {message}
        </div>
    )
}

export default Notification
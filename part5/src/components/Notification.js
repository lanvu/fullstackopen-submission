import React from 'react'

const Notification = ({ status, message }) => {
  if (status === null) {
    return null
  } else if (status === 'error') {
    return <div className="error">{message}</div>
  } else if (status === 'success') {
    return <div className="success">{message}</div>
  }
}

export default Notification

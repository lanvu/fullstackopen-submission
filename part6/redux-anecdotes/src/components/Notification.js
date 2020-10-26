import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, isActive } = useSelector((state) => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  }
  return isActive ? <div style={style}>{message}</div> : null
}

export default Notification

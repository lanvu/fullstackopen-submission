import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const { message, isActive, className } = props.notification

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  }
  return isActive ? (
    <div className={className} style={style}>
      {message}
    </div>
  ) : null
}

export default connect((state) => ({ notification: state.notification }))(
  Notification
)

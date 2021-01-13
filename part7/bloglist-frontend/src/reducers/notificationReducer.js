const notificationAtStart = {
  message: '',
  isActive: false,
  className: 'success',
}

const notificationReducer = (state = notificationAtStart, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      const changedNotification = {
        message: action.message,
        isActive: true,
        className: action.className,
      }
      return changedNotification
    case 'RESET':
      return notificationAtStart
    default:
      return state
  }
}

let timeoutID

export const setNotification = (message, className = 'success') => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_MESSAGE',
      message,
      className,
    })
    clearTimeout(timeoutID)
    timeoutID = setTimeout(
      () =>
        dispatch({
          type: 'RESET',
        }),
      5000
    )
  }
}

export default notificationReducer

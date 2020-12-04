const notificationAtStart = {
  message: '',
  isActive: false,
}

const notificationReducer = (state = notificationAtStart, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      const changedNotification = {
        message: action.message,
        isActive: true,
      }
      return changedNotification
    case 'RESET':
      return notificationAtStart
    default:
      return state
  }
}

let timeoutID

export const setNotification = (message, duration) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_MESSAGE',
      message,
    })
    clearTimeout(timeoutID)
    timeoutID = setTimeout(
      () =>
        dispatch({
          type: 'RESET',
        }),
      duration * 1000
    )
  }
}

export default notificationReducer

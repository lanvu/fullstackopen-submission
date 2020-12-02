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

export const setNotification = (message, duration) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_MESSAGE',
      message,
    })
    setTimeout(
      () =>
        dispatch({
          type: 'RESET',
        }),
      duration * 1000
    )
  }
}

export default notificationReducer

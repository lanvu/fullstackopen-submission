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

export const notificationChange = (message) => {
  return {
    type: 'SET_MESSAGE',
    message,
  }
}

export const notificationReset = () => {
  return {
    type: 'RESET',
  }
}

export default notificationReducer

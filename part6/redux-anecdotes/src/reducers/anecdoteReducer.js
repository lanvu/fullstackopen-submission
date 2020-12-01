const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'INCREMENT_VOTE': {
      const id = action.data.id
      const anecdoteToChange = state.find((n) => n.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      }
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    }
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export const createAnecdote = (data) => {
  return {
    type: 'NEW_ANECDOTE',
    data,
  }
}

export const incrementVoteOf = (id) => {
  return {
    type: 'INCREMENT_VOTE',
    data: { id },
  }
}

export const initializeAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes,
  }
}

export default anecdoteReducer

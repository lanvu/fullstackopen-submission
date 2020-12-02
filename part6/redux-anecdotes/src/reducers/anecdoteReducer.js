import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'INCREMENT_VOTE': {
      const id = action.data.id
      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : action.data
      )
    }
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  }
}

export const incrementVoteOf = (anecdote) => {
  return async (dispatch) => {
    const changedAnecdote = await anecdoteService.updateOne(anecdote.id, {
      ...anecdote,
      votes: anecdote.votes + 1,
    })
    dispatch({
      type: 'INCREMENT_VOTE',
      data: changedAnecdote,
    })
  }
}

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

export default anecdoteReducer

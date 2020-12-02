import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { incrementVoteOf } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <li>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </li>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector((state) => state.anecdote)
  const filter = useSelector((state) => state.filter)
  const filteredAnecdotes = [...anecdotes].filter((a) =>
    a.content.includes(filter)
  )
  const sortedAnecdotes = [...filteredAnecdotes].sort(
    (a, b) => b.votes - a.votes
  )

  const vote = (anecdote) => {
    dispatch(incrementVoteOf(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <ul>
      {sortedAnecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      ))}
    </ul>
  )
}

export default Anecdotes

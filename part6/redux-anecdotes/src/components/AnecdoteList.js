import React from 'react'
import { connect } from 'react-redux'
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

const Anecdotes = (props) => {
  const vote = (anecdote) => {
    props.incrementVoteOf(anecdote)
    props.setNotification(`you voted '${anecdote.content}'`, 5)
  }

  return (
    <ul>
      {props.anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      ))}
    </ul>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes
      .filter((a) => a.content.includes(state.filter))
      .sort((l, r) => r.votes - l.votes),
    filter: state.filter,
  }
}

const mapDispatchToProps = {
  incrementVoteOf,
  setNotification,
}

const ConnectedAnecdotes = connect(
  mapStateToProps,
  mapDispatchToProps
)(Anecdotes)

export default ConnectedAnecdotes

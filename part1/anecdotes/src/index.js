import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = props => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(6).fill(0))
  const [mostVoted, setMostVoted] = useState(0)

  const handleVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)

    const maxVotes = Math.max(...copy)
    if (maxVotes > copy[mostVoted]) {
      let maxIndex = 0
      for (const [i, value] of copy.entries()) {
        if (value === maxVotes) {
          maxIndex = i
          break
        }
      }
      setMostVoted(maxIndex)
    }
  }

  const handleClick = () => {
    setSelected(Math.floor(Math.random() * Math.floor(6)))
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}
      <br />
      has {points[selected]} votes
      <br />
      <button onClick={handleVote}>vote</button>
      <button onClick={handleClick}>next anecdote</button>
      <h1>Anecdote with most vote</h1>
      {props.anecdotes[mostVoted]}
      <br />
      has {points[mostVoted]} votes
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'))

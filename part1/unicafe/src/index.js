import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = props => {
  const { handleClick, text } = props

  return <button onClick={handleClick}> {text}</button>
}

const Statistic = props => {
  const { text, value } = props

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = props => {
  const { good, bad, neutral } = props

  if (good + neutral + bad === 0) {
    return <div>No feedback given</div>
  }
  return (
    <table>
      <tbody>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic text="all" value={good + bad + neutral} />
        <Statistic
          text="average"
          value={(good - bad) / (good + neutral + bad) || 0}
        />
        <Statistic
          text="positive"
          value={((good * 100) / (good + neutral + bad) || 0) + ' %'}
        />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = () => setGood(good + 1)
  const handleClickNeutral = () => setNeutral(neutral + 1)
  const handleClickBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleClickGood} text="good" />
      <Button handleClick={handleClickNeutral} text="neutral" />
      <Button handleClick={handleClickBad} text="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

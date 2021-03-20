import express from 'express'
import calculateBmi from './bmiCalculator'

const app = express()

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!')
})

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query
  const parsedHeight = Number(height)
  const parsedWeight = Number(weight)

  if (isNaN(parsedHeight) || isNaN(parsedWeight)) {
    return res.status(400).send({
      error: 'malformatted parameters',
    })
  }

  return res.send({
    weight: parsedWeight,
    height: parsedHeight,
    bmi: calculateBmi(parsedHeight, parsedWeight),
  })
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

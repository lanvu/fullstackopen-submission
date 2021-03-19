interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

const calculateExercises = (target: number, hours: Array<number>): Result => {
  const periodLength = hours.length
  const trainingDays = hours.filter((h) => h > 0).length
  let rating = null
  let ratingDescription = ''
  const average = hours.reduce((a, b) => a + b) / periodLength

  if (average < target / 2) {
    rating = 1
    ratingDescription = 'bad'
  } else if (average >= target / 2 && average < target) {
    rating = 2
    ratingDescription = 'not too bad'
  } else {
    rating = 3
    ratingDescription = 'good'
  }

  const success = average >= target

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  }
}

const target: number = Number(process.argv[2])
const hours: Array<number> = process.argv.slice(3).map((a) => Number(a))
console.log(calculateExercises(target, hours))

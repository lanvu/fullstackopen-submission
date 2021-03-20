import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { query } = req;
  const height = Number(query.height);
  const weight = Number(query.weight);

  if (query.height === undefined || query.weight === undefined) {
    return res.status(400).send({
      error: 'parameters missing',
    });
  }

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).send({
      error: 'malformatted parameters',
    });
  }

  return res.send({
    weight,
    height,
    bmi: calculateBmi(height, weight),
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (daily_exercises === undefined || target === undefined) {
    return res.status(400).send({
      error: 'parameters missing',
    });
  }

  if (
    !Array.isArray(daily_exercises) ||
    daily_exercises.find((x) => isNaN(Number(x))) ||
    isNaN(Number(target))
  ) {
    return res.status(400).send({
      error: 'malformatted parameters',
    });
  }

  return res.send(calculateExercises(target, daily_exercises));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

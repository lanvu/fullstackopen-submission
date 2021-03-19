const calculateBmi = (height: number, weight: number) => {
  const bmi = weight / (height * height)
  if (bmi < 18.5) {
    return 'Underweight'
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal (healthy weight)'
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight'
  } else if (bmi >= 30 && bmi < 35) {
    return 'Obese'
  } else {
    return 'Extremely obese'
  }
}

console.log(calculateBmi(180, 74));

import express from 'express';
import patientService from '../services/patients';
import { toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPublicEntries());
});

router.get('/:id', (req, res) => {
  try {
    const foundPatient = patientService.getOneEntry(req.params.id);
    if (foundPatient) {
      res.json(foundPatient);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addEntry(newPatient);
    res.json(addedPatient);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;

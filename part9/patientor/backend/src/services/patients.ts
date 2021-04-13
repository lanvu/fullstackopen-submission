import { v1 as uuid } from 'uuid';
import patientData from '../../data/patients';
import { Patient, PublicPatient, NewPatient } from '../types';

const getEntries = (): Patient[] => {
  return patientData;
};

const getPublicEntries = (): PublicPatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getOneEntry = (id: string): Patient | undefined => {
  return patientData.find((p) => p.id === id);
};

const addEntry = (patient: NewPatient) => {
  const id = uuid();
  const newPatient = { ...patient, id };
  patientData.push(newPatient);
  return newPatient;
};

export default {
  getEntries,
  getPublicEntries,
  getOneEntry,
  addEntry,
};

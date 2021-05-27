import { v1 as uuid } from "uuid";
import patientData from "../../data/patients";
import { Patient, PublicPatient, NewPatient } from "../types";

const getAll = (): Patient[] => {
  return patientData;
};

const getAllPublic = (): PublicPatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getOne = (id: string): Patient | undefined => {
  return patientData.find((p) => p.id === id);
};

const addOne = (patient: NewPatient) => {
  const id = uuid();
  const newPatient = { ...patient, id };
  patientData.push(newPatient);
  return newPatient;
};

export default {
  getAll,
  getAllPublic,
  getOne,
  addOne,
};

import { v1 as uuid } from "uuid";
import patientList from "../../data/patients";
import { Patient, PublicPatient, NewPatient, NewEntry } from "../types";

const getAll = (): Patient[] => {
  return patientList;
};

const getAllPublic = (): PublicPatient[] => {
  return patientList.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getOne = (id: string): Patient | undefined => {
  return patientList.find((p) => p.id === id);
};

const addOne = (patient: NewPatient) => {
  const id = uuid();
  const newPatient = { ...patient, id };
  patientList.push(newPatient);
  return newPatient;
};

const addOneEntry = (patientId: string, entry: NewEntry) => {
  const id = uuid();
  const newEntry = { ...entry, id };
  patientList.map((p) => {
    if (p.id === patientId) {
      p.entries.push(newEntry);
    }
    return p;
  });
};

export default {
  getAll,
  getAllPublic,
  getOne,
  addOne,
  addOneEntry,
};

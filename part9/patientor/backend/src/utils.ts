import {
  Gender,
  NewPatient,
  NewBaseEntry,
  NewEntry,
  DiagnosisCodes,
  Discharge,
  SickLeave,
  NewHospitalEntry,
  NewOccupationalHealthcareEntry,
  NewHealthCheckEntry,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === "number";
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const isArray = (value: unknown): boolean => {
  return Array.isArray(value);
};

const parseString = (value: unknown): string => {
  if (!value || !isString(value)) {
    throw new Error("Incorrect or missing input");
  }
  return value;
};

const parseNumber = (value: unknown): number => {
  if (value === undefined || !isNumber(value)) {
    throw new Error("Incorrect or missing input");
  }
  return value;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

interface PatientFields {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
}

export const toNewPatient = ({
  name,
  ssn,
  dateOfBirth,
  gender,
  occupation,
}: PatientFields): NewPatient => {
  return {
    name: parseString(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn),
    gender: parseGender(gender),
    occupation: parseString(occupation),
    entries: [],
  };
};

interface BaseEntryFields {
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes?: unknown;
}

interface HospitalEntryFields extends BaseEntryFields {
  discharge?: unknown;
}

interface OccupationalHealthcareEntryFields extends BaseEntryFields {
  employerName: unknown;
  sickLeave?: unknown;
}

interface HealthCheckEntryFields extends BaseEntryFields {
  healthCheckRating: unknown;
}

const parseDiagnosisCodes = (value: unknown): DiagnosisCodes | undefined => {
  if (!value) {
    return undefined;
  }
  if (!isArray(value) || (value as Array<unknown>).find((a) => !isString(a))) {
    throw new Error("Incorrect diagnosis codes");
  }
  return value as DiagnosisCodes;
};

const parseBaseEntry = ({
  description,
  date,
  specialist,
  diagnosisCodes,
}: BaseEntryFields): NewBaseEntry => {
  const newBaseEntry = {
    description: parseString(description),
    date: parseString(date),
    specialist: parseString(specialist),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
  };
  return newBaseEntry;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDischarge = (value: any): Discharge | undefined => {
  if (!value) {
    return undefined;
  }
  if (
    !value.date ||
    !value.criteria ||
    !isDate(value.date) ||
    !isString(value.criteria)
  ) {
    throw new Error("Incorrect discharge");
  }
  return value as Discharge;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseSickLeave = (value: any): SickLeave | undefined => {
  if (!value) {
    return undefined;
  }
  if (
    !value.startDate ||
    !value.endDate ||
    !isDate(value.startDate) ||
    !isString(value.endDate)
  ) {
    throw new Error("Incorrect sick leave");
  }
  return value as SickLeave;
};

const toHospitalEntry = ({
  description,
  date,
  specialist,
  diagnosisCodes,
  discharge,
}: HospitalEntryFields): NewHospitalEntry => {
  return {
    ...parseBaseEntry({ description, date, specialist, diagnosisCodes }),
    type: "Hospital",
    discharge: parseDischarge(discharge),
  };
};

const toOccupationalHealthcareEntry = ({
  description,
  date,
  specialist,
  diagnosisCodes,
  employerName,
  sickLeave,
}: OccupationalHealthcareEntryFields): NewOccupationalHealthcareEntry => {
  return {
    ...parseBaseEntry({ description, date, specialist, diagnosisCodes }),
    type: "OccupationalHealthcare",
    employerName: parseString(employerName),
    sickLeave: parseSickLeave(sickLeave),
  };
};

const toHealthCheckEntry = ({
  description,
  date,
  specialist,
  diagnosisCodes,
  healthCheckRating,
}: HealthCheckEntryFields): NewHealthCheckEntry => {
  return {
    ...parseBaseEntry({ description, date, specialist, diagnosisCodes }),
    type: "HealthCheck",
    healthCheckRating: parseNumber(healthCheckRating),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = (body: any): NewEntry => {
  const type = body.type as string;
  if (type === "Hospital") {
    return toHospitalEntry(body);
  } else if (type === "OccupationalHealthcare") {
    return toOccupationalHealthcareEntry(body);
  } else if (type === "HealthCheck") {
    return toHealthCheckEntry(body);
  }
  throw new Error("Invalid entry type");
};

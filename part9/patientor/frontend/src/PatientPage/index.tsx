import React, { useEffect } from "react";
import axios from "axios";
import { Icon, Card } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import {
  Patient,
  Entry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
} from "../types";
import { useStateValue, addPatient } from "../state";
import { apiBaseUrl } from "../constants";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HospitalDetails = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <div>
      Discharged on {entry.discharge.date}: {entry.discharge.criteria}
    </div>
  );
};

const OccupationalHealthcareDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  if (!entry.sickLeave) {
    return null;
  }

  return (
    <div>
      Sick leave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
    </div>
  );
};

const HealthcheckDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  const getColor = (rating: number) => {
    return rating === 0
      ? "green"
      : rating === 1
      ? "yellow"
      : rating === 2
      ? "orange"
      : "red";
  };

  return <Icon name="heart" color={getColor(entry.healthCheckRating)} />;
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareDetails entry={entry} />;
    case "HealthCheck":
      return <HealthcheckDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();

  const patient = patients[id];

  useEffect(() => {
    const fetchPatient = async (id: string) => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(addPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    if (!patient || !patient.ssn) {
      void fetchPatient(id);
    }
  }, []);

  if (!patient || Object.keys(diagnoses).length === 0) {
    return null;
  }

  const genderIcon =
    patient.gender === "male"
      ? "mars"
      : patient.gender === "female"
      ? "venus"
      : "genderless";

  const getEntryIcon = (type: string) => {
    return type === "Hospital"
      ? "hospital"
      : type === "OccupationalHealthcare"
      ? "stethoscope"
      : "user md";
  };

  return (
    <div className="App">
      <h2>
        {patient.name}
        <Icon name={genderIcon} />
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <h3>entries</h3>
      <Card.Group>
        {patient.entries &&
          patient.entries.map((entry) => (
            <Card key={entry.id} fluid>
              <Card.Content>
                <Card.Header>
                  {entry.date} <Icon name={getEntryIcon(entry.type)} />
                  {entry.type === "OccupationalHealthcare" && entry.employerName
                    ? entry.employerName
                    : ""}
                </Card.Header>
                <Card.Meta>
                  <i>{entry.description}</i>
                </Card.Meta>
                <Card.Description>
                  {entry.diagnosisCodes && (
                    <ul>
                      {entry.diagnosisCodes.map((code, index) => (
                        <li key={index}>
                          {code} {diagnoses[code].name}
                        </li>
                      ))}
                    </ul>
                  )}
                  <EntryDetails entry={entry} />
                </Card.Description>
              </Card.Content>
            </Card>
          ))}
      </Card.Group>
    </div>
  );
};

export default PatientPage;

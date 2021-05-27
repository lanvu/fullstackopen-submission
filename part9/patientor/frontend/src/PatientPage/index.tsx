import React, { useEffect } from "react";
import axios from "axios";
import { Icon } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { Patient } from "../types";
import { useStateValue, addPatient } from "../state";
import { apiBaseUrl } from "../constants";

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

  if (!patient) {
    return null;
  }

  if (Object.keys(diagnoses).length === 0) {
    return null;
  }

  const genderIcon =
    patient.gender === "male"
      ? "mars"
      : patient.gender === "female"
      ? "venus"
      : "genderless";

  return (
    <div className="App">
      <h2>
        {patient.name}
        <Icon name={genderIcon} />
      </h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <h3>entries</h3>
      {patient.entries &&
        patient.entries.map((entry) => (
          <div key={entry.id}>
            <p>
              {entry.date} <i>{entry.description}</i>
            </p>
            <ul>
              {entry.diagnosisCodes &&
                entry.diagnosisCodes.map((code, index) => (
                  <li key={index}>
                    {code} {diagnoses[code].name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default PatientPage;

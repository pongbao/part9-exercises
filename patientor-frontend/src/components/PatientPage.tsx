import { useState, useEffect } from "react";
import { Diagnosis, DiagnosisEntry, Entry, Patient } from "../types";
import patientService from "../services/patients";
import diagnosisService from "../services/diagnoses";

interface Props {
  id: string | null | undefined;
}

interface EntryProps {
  entry: Entry;
  diagnoses: DiagnosisEntry[];
}

const EntryComponent = ({ entry, diagnoses }: EntryProps) => {
  switch (entry.type) {
    case "HealthCheck": {
      return (
        <div key={entry.id}>
          {entry.date}&nbsp;
          <i>{entry.description}</i>
          <div>
            {entry.diagnosisCodes?.map((code) => {
              const diagnosis = diagnoses.find((d) => d.code === code);
              return (
                <div key={code}>
                  {code} {diagnosis ? diagnosis.name : null}
                </div>
              );
            })}
          </div>
          <div>health check rating: {entry.healthCheckRating}</div>
          <div>diagnosed by {entry.specialist}</div>
        </div>
      );
    }
    case "OccupationalHealthcare": {
      return (
        <div key={entry.id}>
          {entry.date}&nbsp;
          <i>{entry.description}</i>
          <div>
            {entry.diagnosisCodes?.map((code) => {
              const diagnosis = diagnoses.find((d) => d.code === code);
              return (
                <div key={code}>
                  {code} {diagnosis ? diagnosis.name : null}
                </div>
              );
            })}
          </div>
          <div>employer name: {entry.employerName}</div>
          {entry.sickLeave ? (
            <div>
              sick leave: {entry.sickLeave.startDate} to{" "}
              {entry.sickLeave.endDate}
            </div>
          ) : null}
          <div>diagnosed by {entry.specialist}</div>
        </div>
      );
    }
    case "Hospital": {
      return (
        <div key={entry.id}>
          {entry.date}&nbsp;
          <i>{entry.description}</i>
          <div>
            {entry.diagnosisCodes?.map((code) => {
              const diagnosis = diagnoses.find((d) => d.code === code);
              return (
                <div key={code}>
                  {code} {diagnosis ? diagnosis.name : null}
                </div>
              );
            })}
          </div>
          <div>discharge date: {entry.discharge.date}</div>
          <div>discharge criteria: {entry.discharge.criteria}</div>
          <div>diagnosed by {entry.specialist}</div>
        </div>
      );
    }
  }
};

const PatientPage = ({ id }: Props) => {
  const [patient, setPatient] = useState<Patient | undefined | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | undefined | null>(
    null
  );

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const returnedDiagnoses = await diagnosisService.getAll();
      setDiagnoses(returnedDiagnoses);
    };
    void fetchDiagnoses();
  }, []);

  useEffect(() => {
    const fetchPatient = async () => {
      const returnedPatient = await patientService.getPatient(id);
      setPatient(returnedPatient);
    };

    if (id) {
      void fetchPatient();
    }
  }, [id]);

  if (patient && diagnoses) {
    return (
      patient && (
        <div>
          <h2>{patient.name}</h2>
          <div>gender: {patient.gender}</div>
          <div>ssn: {patient.ssn}</div>
          <div>occupation: {patient.occupation}</div>
          <h3>entries</h3>

          {patient.entries.map((entry) => (
            <div key={entry.id}>
              <EntryComponent entry={entry} diagnoses={diagnoses} />
              <br />
            </div>
          ))}
        </div>
      )
    );
  } else {
    return null;
  }
};

export default PatientPage;

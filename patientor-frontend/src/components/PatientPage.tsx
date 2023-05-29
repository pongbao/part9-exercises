import { useState, useEffect } from "react";
import { Patient } from "../types";
import patientService from "../services/patients";

interface Props {
  id: string | null | undefined;
}

const PatientPage = ({ id }: Props) => {
  const [patient, setPatient] = useState<Patient | undefined | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const returnedPatient = await patientService.getPatient(id);
      setPatient(returnedPatient);
    };
    if (id) {
      void fetchPatient();
    }
  }, [id]);

  if (patient === undefined || null) {
    return null;
  } else {
    return (
      patient && (
        <div>
          <h2>{patient.name}</h2>
          <div>gender: {patient.gender}</div>
          <div>ssn: {patient.ssn}</div>
          <div>occupation: {patient.occupation}</div>
        </div>
      )
    );
  }
};

export default PatientPage;

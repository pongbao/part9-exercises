import { useState, useEffect } from "react";
import axios from "axios";
import {
  Diagnosis,
  DiagnosisEntry,
  Entry,
  EntryWithoutId,
  HealthCheckRating,
  Patient,
  ValidationError,
} from "../types";
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

const EntryForm = ({ id }: Props) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [description, setDescription] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");
  const [selectedRating, setSelectedRating] = useState(-1);
  const [employerName, setEmployerName] = useState("");
  const [sickStartDate, setSickStartDate] = useState("");
  const [sickEndDate, setSickEndDate] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [criteria, setCriteria] = useState("");

  const notifStyle = {
    color: "red",
  };

  const notify = (message: string | null) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (selectedOption === "") {
      notify("Invalid entry type");
    } else {
      const entry = {
        date: selectedDate,
        specialist: specialist,
        description: description,
      };
      let newEntry;
      if (diagnosisCodes !== "") {
        const diagnosisArray = diagnosisCodes.split(", ");
        newEntry = { ...entry, diagnosisCodes: diagnosisArray };
      } else {
        newEntry = { ...entry };
      }
      let entryToSubmit: EntryWithoutId | undefined;
      if (selectedOption === "health-check") {
        entryToSubmit = {
          ...newEntry,
          type: "HealthCheck",
          healthCheckRating: selectedRating as HealthCheckRating,
        };
      } else if (selectedOption === "occupational-healthcare") {
        entryToSubmit = {
          ...newEntry,
          type: "OccupationalHealthcare",
          employerName: employerName,
          sickLeave: {
            startDate: sickStartDate,
            endDate: sickEndDate,
          },
        };
      } else {
        entryToSubmit = {
          ...newEntry,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: criteria,
          },
        };
      }
      try {
        await patientService.addEntry(entryToSubmit, id);
      } catch (error) {
        if (
          axios.isAxiosError<ValidationError, Record<string, unknown>>(error)
        ) {
          if (error.response) {
            const validationError = error.response;
            if (typeof validationError.data === "string") {
              const errorString = validationError.data as string;
              const startTag = "<pre>Error: ";
              const endTag = "<br> ";
              const startIndex =
                errorString.indexOf(startTag) + startTag.length;
              const endIndex = errorString.indexOf(endTag, startIndex);
              const errorPortion = errorString.substring(startIndex, endIndex);
              console.log(errorPortion);
              setNotification(errorPortion);
              setTimeout(() => {
                setNotification(null);
              }, 5000);
            }
          } else {
            console.log(error.message);
          }
        } else {
          console.error(error);
        }
      }
    }
  };

  return (
    <div>
      {!visible && (
        <button
          onClick={() => {
            setVisible(!visible);
            setSelectedOption("");
            setSelectedRating(-1);
          }}
        >
          Add new entry
        </button>
      )}
      {visible && (
        <form onSubmit={handleSubmit}>
          <h3>new entry</h3>
          <label htmlFor="type">entry type </label>
          <select
            id="type"
            value={selectedOption}
            onChange={(event) => setSelectedOption(event.target.value)}
          >
            <option value="">-- Select an entry type --</option>
            <option value="health-check">Health Check</option>
            <option value="occupational-healthcare">
              Occupational Healthcare
            </option>
            <option value="hospital">Hospital</option>
          </select>
          <br></br>
          <label htmlFor="date">date </label>
          <input
            id="date"
            name="date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          ></input>
          <br></br>
          <label htmlFor="specialist">specialist </label>
          <input
            id="specialist"
            name="specialist"
            value={specialist}
            onChange={(event) => setSpecialist(event.target.value)}
          ></input>
          <br></br>
          <label htmlFor="description">description </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          ></textarea>
          <br></br>
          <label htmlFor="diagnosis-codes">diagnosis codes </label>
          <input
            id="diagnosis-codes"
            name="diagnosis-codes"
            value={diagnosisCodes}
            onChange={(event) => setDiagnosisCodes(event.target.value)}
          ></input>
          <br></br>
          {selectedOption === "health-check" && (
            <div>
              <label htmlFor="type">health check rating </label>
              <select
                id="health-check-rating"
                value={selectedRating}
                onChange={(event) =>
                  setSelectedRating(
                    Number(event.target.value) as HealthCheckRating
                  )
                }
              >
                <option value="-1">-- Select a health check rating --</option>
                <option value="0">Healthy</option>
                <option value="1">Low Risk</option>
                <option value="2">High Risk</option>
                <option value="3">Critical Risk</option>
              </select>
            </div>
          )}
          {selectedOption === "occupational-healthcare" && (
            <div>
              <label htmlFor="employer-name">employer name </label>
              <input
                id="employer-name"
                name="employer-name"
                value={employerName}
                onChange={(event) => setEmployerName(event.target.value)}
              ></input>
              <br></br>
              <label>sick leave </label>
              <label htmlFor="sick-start">start </label>
              <input
                id="sick-start"
                name="sick-start"
                type="date"
                value={sickStartDate}
                onChange={(event) => setSickStartDate(event.target.value)}
              ></input>
              <label htmlFor="sick-end">end </label>
              <input
                id="sick-end"
                name="sick-end"
                type="date"
                value={sickEndDate}
                onChange={(event) => setSickEndDate(event.target.value)}
              ></input>
            </div>
          )}
          {selectedOption === "hospital" && (
            <div>
              <label htmlFor="discharge-date">discharge date </label>
              <input
                id="discharge-date"
                name="discharge-date"
                type="date"
                value={dischargeDate}
                onChange={(event) => setDischargeDate(event.target.value)}
              ></input>
              <br></br>
              <label htmlFor="discharge-criteria">discharge criteria</label>
              <textarea
                id="discharge-criteria"
                name="discharge-criteria"
                value={criteria}
                onChange={(event) => setCriteria(event.target.value)}
              ></textarea>
            </div>
          )}
          <div style={notifStyle}>{notification}</div>
          <button onClick={() => setVisible(!visible)}>cancel</button>
          <button type="submit">submit</button>
        </form>
      )}
    </div>
  );
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
          <EntryForm id={id} />
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

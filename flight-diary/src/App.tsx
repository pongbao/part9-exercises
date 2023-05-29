import axios from "axios";
import { useState, useEffect } from "react";

import { createEntry, getAllEntries } from "./services/diaryService";
import { DiaryEntry, ValidationError, Visibility, Weather } from "./types";

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<Array<DiaryEntry>>([]);

  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayString = `${year}-${month}-${day}`;

  useEffect(() => {
    getAllEntries().then((data) => {
      setDiaryEntries(data);
    });
  }, []);

  const DiaryEntries = () => {
    return (
      <div>
        <h2>Diary entries</h2>
        {diaryEntries.map((entry) => (
          <div key={entry.id}>
            <h3>{entry.date}</h3>
            <div>visibility: {entry.visibility}</div>
            <div>weather: {entry.weather}</div>
          </div>
        ))}
      </div>
    );
  };

  const DiaryForm = () => {
    const [date, setDate] = useState(todayString);
    const [selectedVisibility, setSelectedVisibility] = useState("ok");
    const [selectedWeather, setSelectedWeather] = useState("sunny");
    const [comment, setComment] = useState("");
    const [notification, setNotification] = useState<string | null>(null);

    const notifStyle = {
      color: "red",
    };

    const entryCreation = (event: React.SyntheticEvent) => {
      event.preventDefault();

      createEntry({
        date: date,
        visibility: selectedVisibility,
        weather: selectedWeather,
        comment: comment,
      })
        .then((data) => {
          setDiaryEntries(diaryEntries.concat(data));
          setNotification("Successfully added entry.");
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          if (
            axios.isAxiosError<ValidationError, Record<string, unknown>>(error)
          ) {
            if (error.response) {
              const validationError = error.response;
              if (typeof validationError.data === "string") {
                setNotification(validationError.data);
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
        });

      setSelectedVisibility("");
      setSelectedWeather("");
      setComment("");
    };

    return (
      <div>
        <h2>Add new entry</h2>
        {notification && <div style={notifStyle}>{notification}</div>}
        <form onSubmit={entryCreation}>
          <div>
            <label>date</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div>
            <label>visibility</label>
            {Object.values(Visibility).map((v) => {
              const visibility = v.toString();
              return (
                <span key={visibility}>
                  <input
                    type="radio"
                    id={visibility}
                    name="visibility"
                    value={selectedVisibility}
                    checked={selectedVisibility === visibility}
                    onChange={() => setSelectedVisibility(visibility)}
                  />
                  <label htmlFor={visibility}>{visibility}</label>
                </span>
              );
            })}
          </div>
          <div>
            <label>weather</label>
            {Object.values(Weather).map((w) => {
              const weather = w.toString();
              return (
                <span key={weather}>
                  <input
                    type="radio"
                    id={weather}
                    name="weather"
                    value={selectedWeather}
                    checked={selectedWeather === weather}
                    onChange={() => setSelectedWeather(weather)}
                  />
                  <label htmlFor={weather}>{weather}</label>
                </span>
              );
            })}
          </div>
          <div>
            <label>comment</label>
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
          <button type="submit">add</button>
        </form>
      </div>
    );
  };

  return (
    <div>
      <DiaryForm />
      <DiaryEntries />
    </div>
  );
};

export default App;

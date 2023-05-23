import express from "express";
import { calculateBMI } from "../intro/bmiCalculator";
import { calculateExercise } from "../intro/exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (req, res) => {
  console.log(req.route.path);
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  try {
    if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
      const bmi = calculateBMI(Number(height), Number(weight));

      res.status(200).send({
        height: Number(height),
        weight: Number(weight),
        bmi: bmi,
      });
    } else {
      throw new Error("malformatted parameters");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    }
  }
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target } = req.body;

  try {
    if (!target || !daily_exercises) {
      throw new Error("parameters missing");
    } else {
      const inputValidator = daily_exercises.filter((input: number) =>
        isNaN(input)
      ).length;

      if (inputValidator === 0 && !isNaN(Number(target))) {
        return res.status(200).send(calculateExercise(target, daily_exercises));
      } else {
        throw new Error("malformatted parameters");
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send({ error: error.message });
    }
    return res.status(400).send(error);
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

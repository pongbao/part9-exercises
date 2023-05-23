import express from "express";
import { calculateBMI } from "../intro/bmiCalculator";
const app = express();

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

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

interface ExerciseValues {
  value1: number;
  value2: Array<number>;
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 10) throw new Error("Not enough arguments");

  const exerciseInput = args.slice(2).map((input) => Number(input));
  const inputValidator = exerciseInput.filter((input) => isNaN(input)).length;

  if (inputValidator === 0) {
    return {
      value1: Number(exerciseInput[0]),
      value2: exerciseInput.slice(1, exerciseInput.length),
    };
  } else {
    throw new Error("Invalid inputs!");
  }
};

const calculateExercise = (target: number, exerciseHours: Array<number>) => {
  const totalHours = exerciseHours.reduce(
    (totalHours, currentHours) => totalHours + currentHours,
    0
  );
  const averageHours = totalHours / exerciseHours.length;

  const rating = () => {
    if (averageHours / target <= 0.5) {
      return 1;
    } else if (averageHours / target < 1) {
      return 2;
    }
    return 3;
  };

  const ratingDescription = (rating: number) => {
    switch (rating) {
      case 1:
        return "try harder if you want to achieve your goals";
      case 2:
        return "not too bad but could be better";
      case 3:
        return "good job!";
    }
  };

  return {
    periodLength: exerciseHours.length,
    trainingDays: exerciseHours.filter((hour) => hour > 0).length,
    success: averageHours > target ? true : false,
    rating: rating(),
    ratingDescription: ratingDescription(rating()),
    target: target,
    average: averageHours,
  };
};

try {
  const { value1, value2 } = parseExerciseArguments(process.argv);
  console.log(calculateExercise(value1, value2));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

interface BMIValues {
  value1: number;
  value2: number;
}

const parseBMIArguments = (args: string[]): BMIValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error("Invalid inputs!");
  }
};

const calculateBMI = (height: number, weight: number): string => {
  const bmi = weight / (height / 100) ** 2;
  if (bmi < 18.5) {
    return "Underweight (unhealthy weight)";
  } else if (bmi < 22.9) {
    return "Normal (healthy weight)";
  } else if (bmi < 24.9) {
    return "Overweight I (at risk)";
  } else if (bmi < 29.9) {
    return "Overweight II (moderately obese)";
  } else {
    return "Overweight (severely obese)";
  }
};

try {
  const { value1, value2 } = parseBMIArguments(process.argv);
  console.log(calculateBMI(value1, value2));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

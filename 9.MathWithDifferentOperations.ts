type calcFunctionType = (num: number) => void;

const calculateFunction = (
  a: number,
  b: number,
  operation: string,
  resultCalcFun: calcFunctionType,
): void => {
  let result: number;

  switch (operation) {
    case "add":
      result = a + b;
      break;

    case "subtract":
      result = a - b;
      break;

    case "multiply":
      result = a * b;
      break;

    case "divide":
      result = a / b;
      break;

    default:
      result = 0;
      break;
  }

  resultCalcFun(result);
};

const resultCalcFun = (result: number): void => {
  console.log(`The result is: ${result}`);
};

calculateFunction(5, 10, "add", resultCalcFun);
calculateFunction(10, 5, "subtract", resultCalcFun);
calculateFunction(5, 10, "multiply", resultCalcFun);
calculateFunction(10, 5,"divide", resultCalcFun);

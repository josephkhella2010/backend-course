//Skill 3: Callbacks That Return Values

// A-Temperature Converter
type ConvertCallback = (celsius: number) => number;
const convertTemperature = (
  celsius: number,
  convertCallBack: ConvertCallback,
): number => {
  return convertCallBack(celsius);
};

convertTemperature(50, (cel: number) => {
  const resultF = (cel * 9) / 5 + 32;
  console.log(`Fahrenheit: ${resultF}`);
  return resultF;
});

convertTemperature(50, (cel: number) => {
  const resultC = ((cel - 32) * 5) / 9;
  console.log(`Celsius: ${resultC}`);
  return resultC;
});

// 2- Array Processor with a Return Value
type ReduceCallback = (acc: number, curr: number) => number;

const processNumbers = (arr: number[], callbackTwo: ReduceCallback): number => {
  return arr.reduce(callbackTwo);
};

const callbackTwo: ReduceCallback = (acc, curr): number => {
  return acc + curr;
};

console.log(processNumbers([1, 2, 3, 4, 5, 6], callbackTwo));

// 3- Challenge: Naming Collision

type Volume = (side: number) => number;

const Volume = (side: number): number => {
  return side ** 3;
};

const applyToCube = (callback: Volume): number => {
  const side = 3;
  return callback(side);
};

console.log(applyToCube(Volume));

// This compiles because TypeScript keeps types and values in separate namespaces.
// "Volume" is a type when used as a type, and "Volume" is a function when used as a value.
// However, using the same name for both can be confusing, so it is better to use different names in real code.

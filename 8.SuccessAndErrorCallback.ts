type successType = (successMessage: string) => void;
type errorType = (errorMessage: string) => void;

const correctFun = (successFun: successType, errorFun: errorType): void => {
  const number: number = Math.floor(Math.random() * 5) + 1;

  console.log("number is", number);
  if (number >= 3) {
    successFun("Operation completed successfully!");
  } else {
    errorFun("Something went wrong!");
  }
};

const successFun = (sms: string): void => {
  console.log(` successMessage: ${sms}`);
};
const errorFun = (sms: string): void => {
  console.log(` errorMessage: ${sms}`);
};
correctFun(successFun, errorFun);

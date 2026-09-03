type letterCaseFunction = (letter: string) => void;

const upperCaseFun = (letter: string, resultFun: letterCaseFunction): void => {
  const result = letter.toUpperCase();
  resultFun(result);
};

const letterResultFun = (result: string): void => {
  console.log(`Word in uppercase is: ${result}`);
};

upperCaseFun("hello", letterResultFun);
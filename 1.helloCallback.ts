type helloFunction = (message: string) => void;

const hello = (helloBack: helloFunction): void => {
  const sms: string = "Hello from callback!";
  helloBack(sms);
};

const helloBack = (message: string): void => {
  console.log(`Hello, ${message}!`);
};
hello(helloBack)

type greetingFunction = (message: string) => void;

const sayHelloLater = (sayHello: greetingFunction): void => {
  setTimeout(() => {
    const sms = "Hi, I am late!";
    sayHello(sms);
        
  }, 2000);
};

const sayHello = (sms: string): void => {
  console.log(sms);
};

sayHelloLater(sayHello);

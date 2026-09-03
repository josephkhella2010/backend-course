

type multiMessageFunType = (message: string) => void;

const multiMessageFun = (
  multiMessageCallBack: multiMessageFunType
): void => {
  multiMessageCallBack("Hello");
  multiMessageCallBack("How are you?");
  multiMessageCallBack("Goodbye");
};

const multiMessageCallBack = (message: string): void => {
  console.log(`Message: ${message}`);
};

multiMessageFun(multiMessageCallBack);
/* 


              // another solution using array and map



type multiMessageFunType = (message: string) => void;

const multiMessageFun = (multiMessageCallBack: multiMessageFunType): void => {
  const messages: string[] = ["Hello", "How are you?", "Goodbye"];

  messages.map((sms: string) => {
    multiMessageCallBack(sms);
  });
};

const multiMessageCallBack = (message: string): void => {
  console.log(`Message: ${message}`);
};

multiMessageFun(multiMessageCallBack);
 */
console.log("week 4");
/// 1- Order Confirmation

type placeOrderType = {
  item: string;
  callback: () => void;
};

const placeOrder = ({ item, callback }: placeOrderType): void => {
  console.log(`Order placed for ${item}`);
  callback();
};

placeOrder({
  item: "Pizza",
  callback: () => {
    console.log("Thanks for your order!");
  },
});
const orderCallback = (): void => {
  console.log("Thanks for your order!");
};

placeOrder({
  item: "Pizza",
  callback: orderCallback,
});

//2- Sum with a Named Type

type SumCallBackType = {
  a: number;
  b: number;
  SumCallback: (result: number) => void;
};
const sumNumbers = ({ a, b, SumCallback }: SumCallBackType): void => {
  const result = a + b;
  SumCallback(result);
};

const SumCallback = (result: number): void => {
  console.log(`the result is ${result}`);
};

sumNumbers({
  a: 10,
  b: 2,
  SumCallback: SumCallback,
});

//3- Challenge (optional): Callback with Multiple Parameters

type CompareCallbackType = (a: number, b: number) => string;

const compareNumbers = (
  a: number,
  b: number,
  callback: CompareCallbackType,
): string => {
  return callback(a, b);
};
const callback = (a: number, b: number): string => {
  let result;

  switch (true) {
    case a > b:
      result = "A is bigger";
      break;

    case b > a:
      result = "B is bigger";
      break;

    case a === b:
      result = "equal";
      break;

    default:
      result = "unknown";
  }
  return ` The Result is ${result}`;
};

console.log(compareNumbers(10, 15, callback));
console.log(compareNumbers(15, 10, callback));
console.log(compareNumbers(10, 10, callback));

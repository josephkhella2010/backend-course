type orderStatusFunction = (order: string) => void;

const orderPizzaFun = (orderStatusFun: orderStatusFunction): void => {
  setTimeout(() => {
    const sms: string = `Your pizza is ready!`;
    orderStatusFun(sms);
  }, 3000);
};
const orderStatusFun = (order: string): void => {
  console.log(order);
};
orderPizzaFun(orderStatusFun);

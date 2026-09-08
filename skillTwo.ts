//Skill 2: Asynchronous Callbacks

type CallBackType = () => void;

const countDown = (seconds: number, callBack: CallBackType): void => {
  setTimeout(() => {
    //console.log("Time's up!");
    callBack();
  }, seconds * 1000);
};

console.log("before countDown");

countDown(3, () => {
  console.log("Countdown finished.");
});

console.log("after countDown");
/*   Order:
   1. before countDown
   2. after countDown
   3. Time's up!
   4. Countdown finished.
   The first two logs happen immediately, while setTimeout waits 3 seconds. */

//Skill 2: Delayed Greeting
type CallBackFunType = () => void;

const delayedGreeting = (
  name: string,
  delay: number,
  callback: CallBackFunType,
) => {
  setTimeout(() => {
     console.log(`Hi ${name}, thanks for waiting!"`);
    callback();
  }, delay * 1000);
};

delayedGreeting("Marco", 2, () => {
  setTimeout(() => {
    console.log("Callback executed!");
  }, 1500);
});

//Skill 3: Challenge (optional): Two Timers, One Order

type CallBackFunTypeTwo = () => void;

const delayedMessageTwo = (
  message: string,
  delay: number,
  callback: CallBackFunTypeTwo,
): void => {
  setTimeout(() => {
    console.log(message);
    callback();
  }, delay);
};



delayedMessageTwo("Message after 3000ms", 3000, () => {
  console.log("Callback for 3000ms");
});

delayedMessageTwo("Message after 1000ms", 1000, () => {
  console.log("Callback for 1000ms");
});

// Prediction:
// "Message after 1000ms" will print first.

// Actual result:
// "Message after 1000ms" prints first.
// "Message after 3000ms" prints second.
// The 1000ms timer finishes before the 3000ms timer, even though the 3000ms call was written first.
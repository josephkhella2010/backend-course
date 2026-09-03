type stepDone = (doneMessage: string) => void;

const stepDoneOne = (stepdoneCallBack: stepDone): void => {
setTimeout(() => {
stepdoneCallBack("Step one done!");
stepDoneTwo(stepdoneCallBack);
}, 1000);
};

const stepDoneTwo = (stepdoneCallBack: stepDone): void => {
setTimeout(() => {
stepdoneCallBack("Step two done!");
stepDoneThree(stepdoneCallBack);
}, 1000);
};

const stepDoneThree = (stepdoneCallBack: stepDone): void => {
setTimeout(() => {
stepdoneCallBack("Step three done!");
}, 1000);
};

const stepdoneCallBack = (sms: string): void => {
console.log(`Step done: ${sms}`);
};

stepDoneOne(stepdoneCallBack);

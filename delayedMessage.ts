// Task 3: Delayed Message

const delayMessage = (message: string, delay: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(message);
    }, delay);
  });
};

const resultDelayMessage = async (): Promise<void> => {
try {
    const response = await delayMessage("hi there", 3000);
    console.log(response);
  } catch (error) {
    console.log("reject reason", error);
  }
};

resultDelayMessage();

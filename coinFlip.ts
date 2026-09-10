//Task 1: Coin Flip

const flipCoin = () => {
  return new Promise<string>((resolve, reject) => {
    const outcome = Math.random() > 0.5;
    outcome ? resolve("You win!") : reject("You lose!");
  });
};

const awaitFlipCoin = async (): Promise<void> => {
  try {
    const message = await flipCoin();
    console.log("message", message);
  } catch (error) {
    console.log("reject reason", error);
  }
};

awaitFlipCoin();

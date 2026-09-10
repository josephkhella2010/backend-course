//Task 7: Combining a Promise and a Fetch

const flipCoinTwo = async (): Promise<void> => {
  const outcome = Math.random() > 0.5;
  try {
    if (outcome) {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();
      console.log("data", data);
    } else {
      console.log("loses");
    }
  } catch (error) {
    console.log("error", error);
  }
};
flipCoinTwo()
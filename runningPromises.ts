//Task 8: Running Promises at the Same Time


const myPromisAll = async (): Promise<void> => {
  try {
    const [res1, res2] = await Promise.all([
      fetch("https://api.adviceslip.com/advice/1"),
      fetch("https://api.adviceslip.com/advice/2"),
    ]);
    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
    console.log("Advice 1:", data1.slip.advice);
    console.log("Advice 2:", data2.slip.advice);
  } catch (error) {
    console.log("Error fetching advice:", error);
  }
};
myPromisAll();

// Task 4: Fetching Advice

const fetchAdvice = async (): Promise<void> => {
  try {
    const res = await fetch("https://api.adviceslip.com/advice");
    const data = await res.json();
    console.log("data", data);
  } catch (error) {
    console.log("reject reason ", error);
  }
};
fetchAdvice();

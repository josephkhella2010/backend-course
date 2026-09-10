const fetchTwoAdvice = async (): Promise<void> => {
  try {
    const res1 = await fetch("https://api.adviceslip.com/advice/1");
    const data = await res1.json();
    console.log(data);
    const res2 = await fetch("https://api.adviceslip.com/advice/2");
    const data2 = await res2.json();
    console.log(data2);
  } catch (error) {
    console.log("Error fetching advice:", error);
  }
};
 fetchTwoAdvice()
//Task 5: Checking the Response

const fetchAdviceByIdTwo = async (id: number):Promise<void> => {
  try {
    const res = await fetch(`https://api.adviceslip.com/advice/${id}`);
    if (!res.ok) {
      throw new Error("Fetching did not work");
    }
    const data = await res.json();
    console.log(" data", data);
  } catch (error) {
    console.log("reject reason", error);
  }
};

fetchAdviceByIdTwo(1);

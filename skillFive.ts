//Skill 5: Promises with fetch

 // A- Different Advice Slip
type AdviceData = {
  slip: {
    id: number;
    advice: string;
  };
};

const fetchAdviceById = (id: number): void => {
  fetch(`https://api.adviceslip.com/advice/${id}`)
    .then((result) => {
      console.log("Status:", result.ok);

      if (result.ok) {
        return result.json();
      }

      throw new Error("Error while fetching advice");
    })
    .then((data: AdviceData) => {
      console.log("data", data.slip.advice);
    })
    .catch((error: unknown) => {
      console.log("Error while fetching:", error);
    });
};

fetchAdviceById(1); 

// 2- Handling a Bad Request

const fetchAdviceByIdError = (id: number): void => {
  fetch(`https://api.adviceslip.com/1234advice/${id}`)
    .then((res) => {
      console.log("Status:", res.status);
      console.log("OK:", res.ok);

      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error while fetching advice");
      }
    })
    .then((data: AdviceData) => {
      console.log("data:", data);
    })
    .catch((error: unknown) => {
      console.log("Error while fetching:", error);
    });
};

fetchAdviceByIdError(2);

//  3- Challenge (optional): A Second API Type
type dataType = {
  fact: string;
  length: number;
};
const chanllengeThreeApi = (): void => {
  fetch("https://catfact.ninja/fact")
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Error while fetching ");
    })
    .then((data: dataType) => {
      console.log(data.fact);
    })
    .catch((error: unknown) => {
      console.log("Error while fetching:", error);
    });
};

chanllengeThreeApi();

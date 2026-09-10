//Task 2: Resolve or Reject

const myPromise = new Promise<string>((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Resolved operation successfully!");
  } else {
    reject("Resolved operation rejected!");
  }
});

const resultMyPromise = async (): Promise<void> => {
  try {
    const response = await myPromise;
    console.log(response);
  } catch (error) {
    console.log("reject reason", error);
  }
};
resultMyPromise();

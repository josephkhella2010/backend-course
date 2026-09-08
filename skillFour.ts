 //Skill 4: Promises

// 1- Your Own Promise


const checkStock = new Promise<string>((resolve, reject) => {
  console.log("Checking stock...");

  const inStock: boolean = true;

  if (inStock) {
    resolve("Item is in stock!");
  } else {
    reject("Item is out of stock!");
  }

  console.log("Promise created!");
})
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log("error in promise", err);
  });

// "After Promise" prints before "Item is in stock!"
// because the Promise executor runs immediately, while .then() runs asynchronously.

console.log("After Promise");
 

// 2 - Tracing Execution Order

const checkDelivery = new Promise<string>((resolve, reject) => {
  console.log("Checking delivery...");

  const delivered: boolean = true;

  if (delivered) {
    resolve("Item has been delivered!");
  } else {
    reject("Item has not been delivered!");
  }
})
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log("Error:", err);
  });
console.log("#".repeat(100));


console.log("After checkDelivery");

// 3 - Forcing a Rejection

const paymentCheck = new Promise<string>((resolve, reject) => {
  console.log("Checking payment...");

  const paymentSuccessful: boolean = false;

  if (paymentSuccessful) {
    resolve("Payment was successful!");
  } else {
    reject("Payment failed.");
  }
})
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);

    console.log(
      "Sorry, your payment could not be completed. Please try again.",
    );
  });

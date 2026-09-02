//Skill 1: Union Types (| means OR)

//A-ID Card

type IDType = string | number;

const showID = (id: IDType): string => {
  return `Your ID is: ${id}`;
};
console.log(showID(12345));
console.log(showID("AB123"));

//B- Fruit Basket

type Fruit = "apple" | "banana" | "orange";

const eatFruit = (fruit: Fruit): string => {
  return `You ate ${
    fruit.charAt(0).toLowerCase() === "a" ||
    fruit.charAt(0).toLowerCase() === "o" ||
    fruit.charAt(0).toLowerCase() === "y" ||
    fruit.charAt(0).toLowerCase() === "i" ||
    fruit.charAt(0).toLowerCase() === "e"
      ? "an"
      : "a"
  } ${fruit}`;
};
console.log(eatFruit("apple"));
console.log(eatFruit("orange"));
console.log(eatFruit("banana"));

// c- Challenge (optional) Pass or Fail
type Result = true | false;

const printResult = (result: Result): string => {
  return result ? "Pass" : "Fail";
};

console.log(printResult(true));
console.log(printResult(false));
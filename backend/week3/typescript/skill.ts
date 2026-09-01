//Skill 1: Union Types (| means OR)

//A-ID Card
console.log(
  "################# Skill 1: Union Types (| means OR) ###################",
);

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

console.log(
  "################# Skill 2: Interfaces & Type Aliases (& means AND)###################",
);

// Skill 2: Interfaces & Type Aliases (& means AND)

// A- Book Interface

interface BookType {
  title: string;
  pages: number;
}

const book: BookType = {
  title: "Harry Botter",
  pages: 350,
};

const describeBook = (book: BookType): string => {
  return `The book ${book.title} has ${book.pages} pages`;
};

console.log(describeBook(book));

// B- Combining Interfaces

interface TeacherType {
  name: string;
  subject: string;
}
interface EmployeeType {
  id: number;
  email: string;
}

type SchoolTeacher = TeacherType & EmployeeType;

const printTeacherInfo = (info: SchoolTeacher): string => {
  return `teacher name: ${info.name} - subject:- ${info.subject} - employee id: ${info.id} - employee email: ${info.email} `;
};

console.log(
  printTeacherInfo({
    name: "Rechard",
    subject: "Science",
    id: 1,
    email: "rechard@gmail.com",
  }),
);

// c- Challenge (optional) Favorite Car

interface CarType {
  brand: string;
  year: number;
}

const printCar = (favoraitCar: CarType): string => {
  return `Brand:${favoraitCar.brand} ,  Year:${favoraitCar.year}`;
};

console.log(
  printCar({
    brand: "Tyoyta",
    year: 2022,
  }),
);

console.log(
  "################# Skill 3: Enums (fixed list of options)###################",
);

//Skill 3: Enums (fixed list of options)

//A- Color Picker

enum Color {
  Red,
  Green,
  Blue,
}

const showColor = (color: Color): string => {
  if (color === Color.Red) {
    return `Red`;
  } else if (color === Color.Green) {
    return `Green.`;
  } else {
    return `Blue.`;
  }
};

console.log(showColor(Color.Red));
console.log(showColor(Color.Green));
console.log(showColor(Color.Blue));

//B- Pizza Order
enum PizzaSizeType {
  Small,
  Medium,
  Large,
}

const orderPizza = (pizzaSize: PizzaSizeType): string => {
  if (pizzaSize === PizzaSizeType.Large) {
    return `You ordered a Large pizza.`;
  } else if (pizzaSize === PizzaSizeType.Medium) {
    return `You ordered a Medium pizza.`;
  } else {
    return `You ordered a Small pizza.`;
  }
};

console.log(orderPizza(PizzaSizeType.Large));
console.log(orderPizza(PizzaSizeType.Medium));
console.log(orderPizza(PizzaSizeType.Small));

//c- Challenge (optional) Role-Based Access

enum RoleType {
  Admin,
  User,
  Guest,
}

const printRole = (role: RoleType): string => {
  switch (role) {
    case RoleType.Admin:
      return "You have full access";

    case RoleType.User:
      return "You have limited access";

    case RoleType.Guest:
      return "You have guest access";
  }
};

console.log(printRole(RoleType.Admin));
console.log(printRole(RoleType.User));
console.log(printRole(RoleType.Guest));

console.log(
  "#################Skill 4: Generics (<T> means reusable placeholder)###################",
);

//Skill 4: Generics (<T> means reusable placeholder)

//A- Wrap It Up

const wrapInArray = <T>(item: T): T[] => {
  return [item];
};

console.log(wrapInArray("cat"));
console.log(wrapInArray(1));

//B- First in Line

const firstItem = <T>(array: T[], val: number): T => {
  const getFirstItem = array[val];
  return getFirstItem;
};

console.log(firstItem(["marco", "harvey", "robert", "john"], 0));
console.log(firstItem([10, 20, 30, 40], 0));

// C- Challenge (optional) Swap Places
const swap = <T>(itemOne: T, itemTwo: T): T[] => {
  [itemOne, itemTwo] = [itemTwo, itemOne];
  const newArr = [itemOne, itemTwo];

  return newArr;
};

console.log(swap(1, 2));
console.log(swap("Hello", "welcome"));

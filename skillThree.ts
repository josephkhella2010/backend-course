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

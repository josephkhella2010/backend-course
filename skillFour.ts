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

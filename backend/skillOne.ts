


const name: string = "Marco";
const age: number = 43;
const isEnrolled: boolean = false;

const describeStudent = (student: string, age: number): string => {
  return `${student} is ${age} years old `;
};

console.log(describeStudent(name, age));

// second question in skill one

const formatGreeting = (name: string, formal?: boolean): string => {
  return formal ? `Good day, ${name}` : `Hi ${name} !`;
};
console.log(formatGreeting("Harvey", true));
console.log(formatGreeting("Robert"));




/* ##################################################################################### */
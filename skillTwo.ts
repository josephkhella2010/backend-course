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
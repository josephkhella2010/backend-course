///////Doubling Ages

const ages: number[] = [10, 20, 30, 40, 50];
const agesInFiveYears: number[] = ages.map((it) => it + 5);
console.log("agesInFiveYears", agesInFiveYears);

///////Filtering Names

const names: string[] = ["Jonathan", "Goergo", "Mary", "Maria", "Adam", "Eva"];

const shortNames = names.filter((na) => na.length <= 4);
console.log("shortNames", shortNames);

//// Challenge (optional) Combined Transformation

const scores: number[] = [20, 30, 40, 50, 70, 80, 90, 100];
const personWhoPassed: string[] = scores
  .filter((grad) => grad >= 50)
  .map((score) => {
    let grade;
    if (score >= 86) {
      grade = "A";
    } else if (score >= 70) {
      grade = "B";
    } else {
      grade = "C";
    }
    return grade;
  });

const personWhoFailed: number[] = scores.filter((grad) => grad < 50);

console.log("personWhoPassed", personWhoPassed);
console.log(
  "personWhoFailed",
  ` there are ${personWhoFailed.length} failed in exam`,
);
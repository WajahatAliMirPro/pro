import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Loop from Jan 2023 to Jun 2025
const start = moment("2023-01-01");
const end = moment("2025-06-30");

const months = [];

while (start.isBefore(end)) {
  months.push(start.clone()); // Save a copy
  start.add(1, "month");
}

const doMonthlyCommits = (index = 0) => {
  if (index >= months.length) return simpleGit().push();

  const month = months[index];
  const daysInMonth = month.daysInMonth();
  const commitsThisMonth = random.int(1, 5); // 1–5 commits per month

  const commitDates = new Set();
  while (commitDates.size < commitsThisMonth) {
    commitDates.add(random.int(1, daysInMonth));
  }

  const dates = [...commitDates].map(day =>
    month.clone().date(day).hour(random.int(9, 17)).minute(random.int(0, 59))
  );

  const makeCommitsForMonth = (i = 0) => {
    if (i >= dates.length) return doMonthlyCommits(index + 1);

    const date = dates[i].format();
    const data = { date };

    console.log(`Committing on: ${date}`);

    jsonfile.writeFile(path, data, () => {
      simpleGit()
        .add([path])
        .commit(`Random commit on ${date}`, { "--date": date }, () =>
          makeCommitsForMonth(i + 1)
        );
    });
  };

  makeCommitsForMonth();
};

doMonthlyCommits();

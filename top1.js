import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

// Generate 1000 random dates in 2025
const generateDates = (count) => {
  let dates = [];
  const start = moment("2025-01-01");
  const end = moment("2025-12-31");
  const totalDays = end.diff(start, "days");

  for (let i = 0; i < count; i++) {
    const dayOffset = random.int(0, totalDays);
    const date = moment(start).add(dayOffset, "days").hour(random.int(0, 23)).minute(random.int(0, 59)).second(random.int(0, 59));
    dates.push(date.format());
  }

  // Sort to reduce Git churn (optional)
  return dates.sort();
};

const commitDates = generateDates(1000);
console.log(`✅ Generated ${commitDates.length} commit dates.`);

let index = 0;
const makeCommit = () => {
  if (index >= commitDates.length) {
    console.log("🚀 All commits created. Now pushing to remote...");
    git.push().then(() => {
      console.log("✅ All commits pushed.");
    });
    return;
  }

  const date = commitDates[index];
  const data = { date };

  jsonfile.writeFile(path, data, () => {
    git.add([path])
      .commit(`Commit ${index + 1}`, { "--date": date }, () => {
        if (index % 100 === 0) console.log(`📦 Committed ${index + 1}/${commitDates.length}`);
        index++;
        setImmediate(makeCommit);
      });
  });
};

makeCommit();

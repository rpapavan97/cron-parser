const parser = require('./parser');
const { CronFields, getDaysInMonth, getMaxDayOfMonth } = require('./utils');

const args = process.argv.slice(2); // slice(2) removes the first two arguments (node path and script path)
let inputData;
// Check if an argument is provided
if (args.length > 0) {
  inputData = args[0]; // First argument after 'node index.js'
  console.log(`Received input: ${inputData}`);
} else {
  console.log("No input provided.");
  return;
}

const splittedInput = inputData.split(" ");

const minuteData = parser(splittedInput[0], CronFields.Minute);
const hourData = parser(splittedInput[1], CronFields.Hour);
const monthData = parser(splittedInput[3], CronFields.Month);

const maxDayVal = getMaxDayOfMonth(monthData); // used only incase of max day value of months

const dayOfMonth = parser(splittedInput[2], CronFields.DayOfMonth, maxDayVal);
const dayOfWeekData = parser(splittedInput[4], CronFields.DayOfWeek);
const command = splittedInput[5];

const cronFields = [
  { field: CronFields.Minute, value: minuteData },
  { field: CronFields.Hour, value: hourData },
  { field: CronFields.DayOfMonth, value: dayOfMonth },
  { field: CronFields.Month, value: monthData },
  { field: CronFields.DayOfWeek, value: dayOfWeekData },
  { field: 'command', value: command }
];

// Define column width for the field name (14 columns wide)
const FIELD_WIDTH = 14;

cronFields.forEach(item => {
  // Format the field name to occupy exactly 14 characters using padding
  const field = item.field.padEnd(FIELD_WIDTH, ' ');
  console.log(`${field}${item.value}`);
});

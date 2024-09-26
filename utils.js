const CronFields = Object.freeze({
  Minute: 'minute',
  Hour: 'hour',
  DayOfMonth: 'dayOfMonth',
  Month: 'month',
  DayOfWeek: 'dayOfWeek',
});

function getDaysInMonth(month, year) {
  // Lookup table for days in each month (ignoring leap year for February initially)
  const daysInMonthLookup = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check if the month is February (index 1) and if it's a leap year
  if (month === 1 && isLeapYear(year)) {
    return 29; // Return 29 days for February in a leap year
  }

  return daysInMonthLookup[month]; // Return the days for other months
}

// Function to check if a year is a leap year
function isLeapYear(year) {
  // Leap year logic: divisible by 4, but not divisible by 100 unless also divisible by 400
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

const getMaxDayOfMonth = (monthData) => {
  if (!monthData) {
    return;
  }

  let dayMaxVal;
  const currentYear = new Date().getFullYear();
  if (monthData.length === 1) {
    dayMaxVal = getDaysInMonth(parseInt(monthData)-1, currentYear);
  }
  const monthValues = monthData.split(' ');
  const monthMaxValues = [];
  monthValues.forEach(element => {
    monthMaxValues.push(getDaysInMonth(parseInt(element)-1, currentYear));
  });

  dayMaxVal = Math.max(...monthMaxValues);

  return dayMaxVal;
}

const CronFieldValues = new Map([
  [CronFields.Minute, [0, 59]],
  [CronFields.Hour, [0, 23]],
  [CronFields.DayOfMonth, [1, 31]],
  [CronFields.Month, [1, 12]],
  [CronFields.DayOfWeek, [0, 6]],
]);

module.exports = { CronFields, CronFieldValues, getDaysInMonth, getMaxDayOfMonth }
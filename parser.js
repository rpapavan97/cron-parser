const { CronFields, CronFieldValues } = require("./utils");

const parseResult = (arr) => {
  return arr.join(" ")
}

const computeResult = ( startVal, endVal, stepCount = 1 ) =>{
  const result = [];
  for( let i = startVal; i <= endVal; i+= stepCount ){
    result.push(i);
  }
  return result;
}

const hyphenParser = (input) => {
  const splitInput = input.split('-');
  const startVal = parseInt(splitInput[0]);
  const endVal = parseInt(splitInput[1]);
  const result = computeResult( startVal, endVal );
  return parseResult(result);
}

const commaParser = (input) => {
  return input.replace(/,/g, ' ');
}

const wildCardParser = (field) => {
  if (field === CronFields.Minute) { // 0-59
    const result = Array.from(Array(60).keys());
    return parseResult(result);
  }
  if (field === CronFields.Hour) { // 0-23
    const result = Array.from(Array(24).keys());
    return parseResult(result);
  }
  if (field === CronFields.DayOfWeek) { // 0-6
    const result = Array.from(Array(7).keys());
    return parseResult(result);
  }
  if (field === CronFields.Month) { // 1-12
    const result = Array.from({ length: 12 }, (_, i) => i + 1);
    return parseResult(result);
  }
  if (field === CronFields.DayOfMonth) { // 1-31
    const result = Array.from({ length: 31 }, (_, i) => i + 1);
    return parseResult(result);
  }
}

const slashParser = (input, field, maxVal = undefined) => {
  const splitInput = input.split('/');
  let [fieldStartValue, fieldEndValue] = CronFieldValues.get(field);
  let startVal = splitInput[0];
  const intervalVal = parseInt(splitInput[1]);
  if (startVal == '*') {
    startVal = fieldStartValue;
  } else {
    startVal = parseInt(splitInput[0]);
  }

  if (maxVal) {
    fieldEndValue = maxVal
  }

  const result = computeResult( startVal, fieldEndValue, intervalVal);
  return parseResult(result);
}

// allowed values [0-59]
// * -> wildcard (runs every minute)
// / -> (steps) (startVal/stepVal -> starts with startVal and increases by stepVal)
// , -> (runs at every minutes of comma values) (1,10,20,30 -> 1,20,,30,40)
// - -> Hyphen (runs every minute between inputs) (1-5 -> 1,2,3,4,5)
// 15 -> 15th minute
const parser = (input, field, maxVal = undefined) => {
  const specialChars = ['*', '/', '-', ','];
  const chars = []; // to-do
  let isSpecialCharPresent = false;
  specialChars.forEach(char => {
    if (input.includes(char)) {
      isSpecialCharPresent = true;
      if (!chars.includes(char)) {
        chars.push(char);
      }
    }
  })
  if (!isSpecialCharPresent) {
    return input;
  }

  if (input.length === 1 && input === "*") {
    return wildCardParser(field);
  }
  if (chars.length === 1 && chars[0] === '-') {
    return hyphenParser(input)
  }
  if (chars.length === 1 && chars[0] === ',') {
    return commaParser(input);
  }
  return slashParser(input, field, maxVal);
}

module.exports = parser;

/*
* * * * *
1,2,3 * * * *
12/10 * * * * 12,22,32,42,52
1-17 * * * *
5-15,55-59 * * * *
20 * * * *
*/


function firstStep(input) {
  // Your code here
  return input.split('&');
}

function secondStep(input) {
  // Your code here
  return input.map(pair => {
    return pair.split('=')
  })
}

function thirdStep(input) {
  // Your code here
  return input.map(pair => {
    return [pair[0], pair[1].replace(/\+/g, " ")]
  })
}

function fourthStep(input) {
  // Your code here
  return input.map(pair => {
    return [pair[0], decodeURIComponent(pair[1])];
  })
}

function fifthStep(input) {
  // Your code here
  const object = {};
  input.forEach(pair => {
    object[pair[0]] = pair[1];
  })

  return object;
}

function parseBody(str) {
  // Your code here
  str = firstStep(str);
  str = secondStep(str);
  str = thirdStep(str);
  str = fourthStep(str);
  str = fifthStep(str);
  return str;
}

const test = "username=azure+green&password=password%21"
console.log(thirdStep(secondStep(firstStep(test))))

/******************************************************************************/
/******************* DO NOT CHANGE THE CODE BELOW THIS LINE *******************/

module.exports = {
  firstStep,
  secondStep,
  thirdStep,
  fourthStep,
  fifthStep,
  parseBody
};
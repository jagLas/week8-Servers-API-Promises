function stretch(timeLeft) {
  // refactor your code from phase 1
  // Your code here
  const stretchTime = 1000;

  return new Promise ((resolve, reject) => {
    if (stretchTime <= timeLeft) {
      console.log('done stretching');
      resolve(timeLeft - stretchTime);
    } else {
      throw new Error('Not enough time to stretch')
    }
  })
}


function runOnTreadmill(timeLeft) {
  // refactor your code from phase 1
  // Your code here
  const treadmillTime = 500;

  if (treadmillTime <= timeLeft) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('done running on the treadmill')
        resolve(timeLeft - treadmillTime)
      }, treadmillTime)
    })
  } else {
    throw new Error('Not enough time to run on the treadmill')
  }
}


function liftWeights(timeLeft) {
  // refactor your code from phase 1
  // Your code here
  const liftingTime = 2000;

  if (liftingTime <= timeLeft) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('done lifting weights')
        resolve(timeLeft - liftingTime)
      }, liftingTime)
    })
  } else {
    throw new Error('Not enough time to lift weights')
  }
}


function workout(totalTime) {
  // refactor your code from phase 1
  // Your code here
  stretch(totalTime)
  .then((timeLeft) => runOnTreadmill(timeLeft))
  .then(timeLeft => liftWeights(timeLeft))
  .then((timeLeft) => console.log(`done working out with ${timeLeft / 1000} seconds left`))
  .catch(error => {
    console.error('Error:', error.message)
  });
}

/* ============================ TEST YOUR CODE ============================

Comment in each invocation of your workout function below and run the file
(node phase-2.js) to see if you get the expected output.
*/


workout(500);
  // should print out the following:
    // Error:  you dont have enough time to stretch


// workout(1000);
  // should print out the following:
    // done stretching
    // Error:  you dont have enough time to run on treadmill


// workout(2000);
  // should print out the following:
    // done stretching
    // done running on treadmill
    // Error:  you dont have enough time to lift weights


// workout(4000);
  // should print out the following:
  //   done stretching
  //   done running on treadmill
  //   done lifting weights
  //   done working out with 0.5 seconds left
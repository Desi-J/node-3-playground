const express = require('express');
const bodyParser = require('./body-parser');
const axios = require('axios');
const values = require('./values');
const utils = require('./utils');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  if (!req.body.name) {
    res.status(400).send('You did not specify a name in the request body');
    return;
  }
  next();
});

function checkAirspeed(req, res, next) {
  if (req.body.whatIsTheAirSpeedVelocityOfAnUnladenSwallow === 'African or European?') {
    next();
  } else {
    res.status(400).send('You failed challenge 1');
  }
}

function checkFormattedString(req, res, next) {
  if (req.body.formattedString === utils.formatDate(new Date())) {
    next();
  } else {
    console.log(req.body.name + ' has completed checkFormattedString');
    res.status(400).send('You passed checkFormattedString! But you failed the subsequent challenge');
  }
}

function checkPublicIP(req, res, next) {
  axios.get(`http://icanhazip.com`).then(response => {
    // Remove trailing newline character
    const answer = response.data.slice(0, -1);
    if (req.body.myPublicIP === answer) {
      next();
    } else {
      console.log(req.body.name + ' has completed checkPublicIP');
      res.status(400).send('You passed checkPublicIP! But you failed the subsequent challenge');
    }
  }).catch(error => {
    console.log('error', error);
  })
}

function checkClosure(x, y) {
  const sum = x + y;
  return function(req, res, next) {
    if (req.body.sum === sum) {
      next();
    } else {
      console.log(req.body.name + ' has completed checkClosure');
      res.status(400).send('You passed checkClosure! But you failed the subsequent challenge');
    }
  }
}

function checkUnderstanding(req, res, next) {
  const answer = [{
    employeedId: 1,
    salary: 60000
  }, {
    employeedId: 2,
    salary: 61000
  }, {
    employeedId: 3,
    salary: 62000
  }].filter(e => e.salary > 60000).map(e => e.salary).reduce((avg, v, i, a) => {
    return avg + v / a.length
  }, 0);
  if (req.body.understanding === answer) {
    next();
  } else {
    console.log(req.body.name + ' has completed checkUnderstanding');
      res.status(400).send('You passed checkUnderstanding! But you failed the subsequent challenge');
  }
}

app.post('/challenge', checkAirspeed, checkUnderstanding, checkFormattedString, checkClosure(7, 11), checkPublicIP, (req, res) => {
  console.log(req.body.name + ' has completed all challenges!');
  res.json({
    message: 'You did it!',
    whoIsAwesome: req.body.name + '!',
  });
})

app.post('/who', (req, res) => {
  res.send('me');
});

const port = 3005;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

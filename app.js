const { fork } = require('child_process');

console.log('Welcome ! This app simulates an asynchronous communication between a washing machine and a driver')
console.log('-> Press 1  to start a cycle')
console.log('-> Press 2  to get the state of the machine')
console.log('-> Press 3  to stop the current cycle')


// Start driver process
const driverProcess = fork('driver.js');

driverProcess.on('message', (msg) => {
  console.log('Message from driver', msg);
});

// Start instrument process
const instrumentProcess = fork('instrument.js');

instrumentProcess.on('message', (msg) => {
  console.log('Message from instrument', msg);
});




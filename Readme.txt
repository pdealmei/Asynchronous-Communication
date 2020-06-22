Labforward Embedded Engineer Challenge

1/ INTRODUCTION

This nodeJS app provides an illustration of how asynchronous serial communication works between a serial device and a driver. 
I considered the instrument to be a washing machine that performs a cycle when the user requests it. 

A cycle consists of 4 operations:
- Washing
- Rinsing
- Spinning
- Drying

Each operations are considered to take the same amount of time.

The user can do the following operations:
- Start a cycle 
- Ask for the status of the machine (ie which operation of the cycle being processed)
- Stop the cycle


2/ INSTALLATION

Clone the repository, access it and run 'npm install' to get the dependencies

Run 'npm run start' to start the app

3/ ARCHITECTURE

The 'app.js' file simply launches two asynchronous processes: one in driver.js and the other in instrument.js

The driver process listens for command line inputs ad writes them in ASCII to a text file (command.txt). Each command is separated by ','.

The instrument part watches out for any changes within this text file and interprets each command. 

4/ DEFINITION OF 'DONE'

For me the goal of this project was to clearly demonstrate in real time how asynchronous communication works. It was important that the instrument and device ran in two different processes, and that the user had the possibility of displaying the state of the machine, even when a cycle is running. 

I also tried to use a lot of different node.js principles so that you can get a better understanding of my coding style.

NB: Here the simulation of the machine and its cycles is very basic (simply changing the states after each given time interval) as I didn't think that having a complex and realistic mechanism was the point of this exercise.

5/ TESTS

Run 'npm run test' to launch the unit tests, each testing that the write and read operations are performed successfully.

I used mocha for the unit tests, along with rewire in order to manipulate certain variables just for test.

The tests use different text files (driver_test and instrument_test) to isolate the testing of each process.








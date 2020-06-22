var fs = require('fs')
const file = 'command.txt'

var operationTimeout, state

// Timers
const cycleTimer     = 2000
const listeningTimer = 2000

// Commands
const startCmd    = '1'
const getStateCmd = '2'
const stopCmd     = '3'

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Initialize the instrument
 */
function initInstrument(callback){
    state = 'Init'
    process.send({instrument: 'Instrument initialized'})
    callback(state)
}

exports.init = initInstrument

/**
 * Start watching the specified file and call the readCommand(fs,file) function when a change is detected
 */
function startListening() {
    process.send({instrument: 'Listening for commands'})
    fs.watchFile(file, { interval: listeningTimer } , function (curr, prev) {
        readCommand( () => {})
    })
}

/**
 * Reads the data inside command.txt
 */
function readCommand (callback) {
    var cmd = ''

    // Read from file
    fs.readFile(file , 'utf8',(err , data) => {
        if (err) throw err
        if(data != '' && data != undefined){
            
            // Interpret command
            cmd = parseData(data)
            interpretCommand(cmd)
            callback(cmd)
        }
    })
}

exports.read = readCommand

/**
 * Extracts the first command from the queue read in command.txt
 * @param {String} data string read in command.txt
 */
function parseData(data) {
    var cmd = ''

    // Get first command separated by ','
    var asciiCmd = data.split(',')[0]

    // Remove command from queue
    if(data != '')
    {
        let result = data.replace(asciiCmd + ',', '')
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) throw err
        }) 
    }
    // Translate from ASCII
    cmd = String.fromCharCode(asciiCmd)
    process.send({instrument: 'Received: ' + asciiCmd + ' Meaning: ' + cmd})
    // Return the translated command
    return(cmd)
}

/**
 * Simulate the cycle from a washing machine. 
 * When starting a cycle, the following operations are processed in order:
 * Washing -> Rinsing -> Spinning -> Drying -> Done
 * All cycles last the same amount of time, defined by cycleTimer
 */
function startCycle()
{
    process.send({instrument: 'Starting cycle'})
    state = 'Washing'
    operationTimeout =setTimeout(() => {
        state = 'Rinsing'
        operationTimeout = setTimeout(() => {
            state = 'Spinning'
            operationTimeout = setTimeout(() => {
                state = 'Drying'
                operationTimeout = setTimeout(() => {
                    // Cycle is done, so go back to init
                    state = 'Init'
                },cycleTimer)
            },cycleTimer)
        },cycleTimer)
    },cycleTimer)
}


/**
 * Interprets the formatted data returned by parseData
 * @param {String} data character sent by the user
 */
function interpretCommand(data)
{
    if(data === startCmd)
    {
        process.send({instrument: 'Start cycle requested'})

        if(state != 'Init')
        {
            process.send({instrument: 'Error: wrong state, please wait for the current cycle to be over'})
            process.send({instrument: state})
        }
        else {
            startCycle()  
        }
    }

    else if(data === getStateCmd)
    {
        process.send({instrument: 'Command recognized, the state is: ' + state})
    }

    else if(data === stopCmd)
    {
        process.send({instrument: 'Command recognized, stopping cycle'})
        clearTimeout(operationTimeout)
        state = 'Init'
    }

    else if (data === '')
    {
        /* Do nothing */
    }

    else{
        process.send({instrument: 'Command unrecognized'})
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize the instrument
initInstrument(() => {
    // Start listening for commands
    startListening()
})



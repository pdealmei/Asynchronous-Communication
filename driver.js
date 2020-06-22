var stdin = process.openStdin()
var fs = require('fs')
file = 'command.txt'

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Initialize the driver
 */
function initDriver(callback) {
    new Promise ((resolve) => {
        fs.writeFile(file, '', (err) => {
            if (err) throw err
            process.send({ driver: 'Driver initialized' })
            resolve()
        })
    })
    .then(() => {
        callback()
    })
}

exports.init = initDriver

/**
 * Write the string typed by the user into command.txt, separating each character by ','
 * @param {String} data 
 */
function writeCommand(data) {
        process.send({ driver: 'Sending: ' + data })
        var asciiData=[]
        let i;
        for (i = 0; i < data.length; i++) {
            asciiData[i] = data.charCodeAt(i).toString()
        }
        const buf = Buffer.alloc(data.length, data);
        process.send({ driver: 'Writing command in ASCII : '  + asciiData })
        
        // Write to file
        fs.appendFile(file , asciiData + ',' , (err) => {
            if(err) throw err
        })  
}

exports.write = writeCommand

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize the driver
initDriver( () => {

    // Start listening for user input once the driver is initialized
    stdin.addListener('data', function(data) {

        //Write to file when a command is detected
        writeCommand(data.toString().trim()) 
    })
})




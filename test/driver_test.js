const assert = require('assert');
const testFile = './test/driver_test.txt'
var fs = require('fs')
var sinon = require('sinon')
var rewire = require("rewire");
var driverRewire = rewire("../driver.js");

/**
 * This test first writes a string to the command.txt file and tests whether the init function deletes it
 * It then tests the writeCommand function by checking whether the data in ASCII format corresponds to the request
 */
describe('Driver module', () => {

    process.send = sinon.stub()
    driverRewire.__set__({
        // We perform the tests on './test/driver_test.txt' rather than command.txt
        file: testFile 
    })

    it('init and write',() => {

        init =driverRewire.__get__('initDriver')
        write =driverRewire.__get__('writeCommand')

        // Write data to test file
        fs.writeFile(testFile,'Testing init function',  (err, data) => {
            if (err) throw err
            // Call the init function that should remove the data we just wrote
            init( () => {
                fs.readFile(testFile , 'utf8',(err , data) => {
                    if (err) throw err

                    // Check that the init function worked properly
                    assert.strictEqual(data , '')

                    // Write some more data to the test file
                    write('Testing write function')

                    fs.readFile(testFile, 'utf-8' ,(err, data ) => {

                        // Check that the converted ASCII data corresponds to the previous string ('Testing write function')
                        assert.strictEqual(data, '84,101,115,116,105,110,103,32,119,114,105,116,101,32,102,117,110,99,116,105,111,110,')
                    })
                })
            })
        })
    })
})

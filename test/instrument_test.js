const assert = require('assert');
const testFile = './test/instrument_test.txt'
var fs = require('fs')
var sinon = require('sinon')
var rewire = require("rewire");

var instrumentRewire = rewire("../instrument.js");

/**
 * This test first writes a string to the command.txt file and tests whether the init function deletes it
 * It then tests the writeCommand function by checking whether the data in ASCII format corresponds to the request
 */
describe('Instrument module', () => {


    process.send = sinon.stub()

    instrumentRewire.__set__({
        // We perform the tests on './test/instrument_test.txt' rather than command.txt
        file: testFile
    })

    it('read',() => {
        init =instrumentRewire.__get__('initInstrument')
        read =instrumentRewire.__get__('readCommand')

        // Initialize module
        init( (state) => {
            // Check that the state is at init
            assert.strictEqual(state, 'Init')

            // Write '65' ('A' in ASCII) to the test file 
            fs.writeFile(testFile, '65,', 'utf-8', (err,data) => {
                if(err) throw err
                read( (cmd) => {
                    // Check that 'A' is read
                    assert.strictEqual(cmd, 'A')
                })
            })
        })
    })
})


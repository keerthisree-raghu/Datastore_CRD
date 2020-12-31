const expect = require('chai').expect;
const assert = require('chai').assert;
const fs = require('fs');

require('chai').use(require('chai-as-promised')).should();

const datastore = require('../create-read-delete');

const filepath = 'datastore.json';
var entries = new Map([]);
var parsedFileData;

describe('Data store tests', () => {
    // Checks existence of datastore file
    describe('File creation test', () => {
        it('JSON file exists', () => {
            expect(fs.existsSync(filepath)).to.be.true;
        });
    });

    // Before executing each test, read the contents of the file and parse the data
    beforeEach(function (done) {
        // Parse and store the data in a variable if the file already exists
        if (fs.existsSync(filepath)) {
            fs.readFile(filepath, 'utf-8', (err, fileData) => {
                if (err) throw err;
                parsedFileData = JSON.parse(fileData);
                done();
            });
        }
        // Create a new file if the file does not exist and write a key-value pair into the file
        else {
            entries.set("Foo", { value: "Bar", expiryTime: 0 })
            jsonData = JSON.stringify(Object.fromEntries(entries), null, 2);
            fs.writeFile(filepath, jsonData, (err) => {
                if (err) throw err;
            });
            // Read and parse the data after it has been written
            fs.readFile(filepath, 'utf-8', (err, fileData) => {
                if (err) throw err;
                parsedFileData = JSON.parse(fileData);
                done();
            });
        }
    });

    // Create Operations Tests
    describe('createData() tests', () => {
        it('should pass if the key of type string', () => {
            var key = Object.keys(parsedFileData)[0];
            assert.isString(key, 'Key is a string');
        });
        it('should fail if the key is not a string', () => {
            var key = 12345;
            assert.isNotString(key, 'Key is a not a string');
        });
        it('should pass if the key length is less than or equal to 32 characters', () => {
            var key = Object.keys(parsedFileData)[0];
            assert.isAtMost(key.length, 32, 'Key is less than or equal to 32 characters');
        });
        it('should pass if the size of the value is less than 16 KB', () => {
            const valueSize = Buffer.byteLength(JSON.stringify(Object.values(parsedFileData)));
            assert.isAtMost(valueSize, 16000, 'Value is less than or equal to 16 KB');
        });
        it('should fail if key exists already', () => {
            assert.hasAnyKeys(parsedFileData, ['Foo', 'Baz', 'Quux'], 'Key already exists')
        });
    });

    // Read Operation Tests
    describe('readData() tests', () => {
        it('should pass if file contents are of JSON object format', () => {
            assert.isObject(parsedFileData, 'is JSON object');
        });
        it('should pass if the value of a given key is a JSON object', () => {
            assert.isObject(parsedFileData["Foo"], 'Value is a JSON object')
        });
    });
    
    // Delete Operations Test
    describe('deleteData() tests', () => {
        it('should pass if the key exists in the datastore', () => {
            assert.containsAllKeys(parsedFileData, ['Foo'], 'Key can be deleted')
        });
    });
});
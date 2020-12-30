const expect = require('chai').expect;
const assert = require('chai').assert;
const fs = require('fs');

require('chai').use(require('chai-as-promised')).should();

const datastore = require('../create-read-delete');

const filepath = 'datastore.json';
var entries = new Map([]);
var object;

describe('Data store tests', () => {
    describe('File creation test', () => {
        it('JSON file exists', () => {
            expect(fs.existsSync(filepath)).to.be.true;
        });
    });

    beforeEach(function (done) {
        if (fs.existsSync(filepath)) {
            fs.readFile(filepath, 'utf-8', (err, data) => {
                if (err) throw err;
                object = JSON.parse(data);
                done();
            });
        }
        else {
            entries.set("Foo", { name: "Bar", age: 25 })
            jsonData = JSON.stringify(Object.fromEntries(entries), null, 2);
            fs.writeFile(filepath, jsonData, (err) => {
                if (err) throw err;
            });
            fs.readFile(filepath, 'utf-8', (err, data) => {
                if (err) throw err;
                object = JSON.parse(data);
                done();
            });
        }
    });

    describe('readData() tests', () => {
        it('should pass if file contents are of JSON object format', () => {
            assert.isObject(object, 'is JSON object');
        });
        it('should pass if the value of a given key is a JSON object', () => {
            assert.isObject(object["Foo"], 'Value is a JSON object')
        });
    });

    describe('createData() tests', () => {
        it('should pass if the key of type string', () => {
            var key = Object.keys(object)[0];
            assert.isString(key, 'Key is a string');
        });
        it('should fail if the key is not a string', () => {
            var key = 12345;
            assert.isNotString(key, 'Key is a not a string');
        });
        it('should pass if the key length is less than or equal to 32 characters', () => {
            var key = Object.keys(object)[0];
            assert.isAtMost(key.length, 32, 'Key is less than or equal to 32 characters');
        });
        it('should pass if the size of the value is less than 16 KB', () => {
            const valueSize = Buffer.byteLength(JSON.stringify(Object.values(object)));
            assert.isAtMost(valueSize, 16000, 'Value is less than or equal to 16 KB');
        });
        it('should fail if key exists already', () => {
            assert.hasAnyKeys(object, ['Foo', 'Baz', 'Quux'], 'Key already exists')
        });
    });

    describe('deleteData() tests', () => {
        it('should pass if the key exists in the datastore', () => {
            assert.containsAllKeys(object, ['Foo'], 'Key can be deleted')
        });
    });
});
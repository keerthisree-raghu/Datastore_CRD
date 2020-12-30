const fs = require("fs");

const filepath = 'datastore.json';

var entries = new Map([]);

createData = (key, value, timeToLive = 0) => {
    const valueSize = Buffer.byteLength(JSON.stringify(value));
    var expiryTime = timeToLive * 1000;
    if (fs.existsSync(filepath)) {
        fs.readFile(filepath, 'utf8', (err) => {
            if (err) {
                console.log(err);
            } else if (entries.has(key)) {
                console.log("Key already exists.");
            } else if (typeof key === 'string' && key.length <= 32 && valueSize <= 16000) {
                val = {value, expiryTime};
                entries.set(key, val);
                jsonData = JSON.stringify(Object.fromEntries(entries), null, 2);
                fs.writeFileSync(filepath, jsonData, err => {
                    if (err) throw err;
                });
            } else {
                console.log("Key must be a string less than 32 characters and value must not exceed 16 KB.")
            }
        });
    }
    else {
        val = {value, expiryTime};
        entries.set(key, val);
        jsonData = JSON.stringify(Object.fromEntries(entries), null, 2);
        fs.writeFileSync(filepath, jsonData, err => {
            if (err) throw err;
        });
    }
    if (expiryTime > 0) {
        setTimeout(deleteData, expiryTime, key);
    }
}

readData = (key) => {
    if (fs.existsSync(filepath)) {
        setTimeout(() => fs.readFile(filepath, (err, fileData) => {
            const object = JSON.parse(fileData);
            if (err) throw err;
            else if (object[key] && entries.has(key)) {
                console.log(object[key]);
            }
            else {
                console.log(`"${key}" key does not exist or has expired.`);
            }
        }), 1000);
    }
    else {
        console.log("File does not exist.");
    }
}

deleteData = (key) => {
    if (fs.existsSync(filepath)) {
        setTimeout(() => fs.readFile(filepath, (err, fileData) => {
            const object = JSON.parse(fileData);
            if (err) throw err;
            else if (object[key] && entries.has(key)) {
                delete object[key];
                entries.delete(key);
                fs.writeFileSync(filepath, JSON.stringify(Object.fromEntries(entries), null, 2));
            }
            else {
                console.log(`"${key}" key does not exist or has expired.`);
            }
        }), 500);
    }
    else {
        console.log("File does not exist.");
    }
}

module.exports = { createData, readData, deleteData };
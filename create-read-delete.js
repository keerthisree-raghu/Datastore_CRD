const fs = require("fs");

const filePath = "datastore.json";

var entries = new Map([]);

// Creates and writes key-value pair data into a json file with optional time-to-live property
createData = (key, value, expiryTime = 0) => {
    const valueSize = Buffer.byteLength(JSON.stringify(value));
    var timeToLive = expiryTime * 1000;
    // Read file if the file already exists
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, "utf8", (err, fileData) => {
            const fileSize = Buffer.byteLength(JSON.stringify(fileData));
            if (err) {
                console.log(err);
            } else if (fileSize >= 1000000000) {
                console.log("File size limit breached. (Max limit: 1 GB)");
            } else if (entries.has(key)) {
                console.log("Key already exists.");
            } else if (typeof key === "string" && key.length <= 32 && valueSize <= 16000) {
                val = { value, timeToLive };
                entries.set(key, val);
                jsonData = JSON.stringify(Object.fromEntries(entries), null, 2);
                fs.writeFileSync(filePath, jsonData, err => {
                    if (err) throw err;
                });
            } else {
                console.log("Key must be a string less than 32 characters and value must not exceed 16 KB.")
            }
        });
    }
    // Create new file if one does not exist
    else {
        val = { value, timeToLive };
        entries.set(key, val);
        jsonData = JSON.stringify(Object.fromEntries(entries), null, 2);
        fs.writeFileSync(filePath, jsonData, err => {
            if (err) throw err;
        });
    }
    // Delete the data from the datastore once the expiry time has lapsed
    if (timeToLive > 0) {
        setTimeout(deleteData, timeToLive, key);
    }
}

// Reads data from the file and returns the value for the given key in JSON object form
readData = (key) => {
    if (fs.existsSync(filePath)) {
        setTimeout(() => fs.readFile(filePath, (err, fileData) => {
            const parsedFileData = JSON.parse(fileData);
            if (err) throw err;
            else if (parsedFileData[key] && entries.has(key)) {
                console.log(parsedFileData[key]);
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

// Deletes the key-value pair data from the data store for the given key
deleteData = (key) => {
    if (fs.existsSync(filePath)) {
        setTimeout(() => fs.readFile(filePath, (err, fileData) => {
            const parsedFileData = JSON.parse(fileData);
            if (err) throw err;
            else if (parsedFileData[key] && entries.has(key)) {
                delete parsedFileData[key];
                entries.delete(key);
                jsonData = JSON.stringify(Object.fromEntries(entries), null, 2);
                fs.writeFileSync(filePath, jsonData, err => {
                    if (err) throw err;
                });
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
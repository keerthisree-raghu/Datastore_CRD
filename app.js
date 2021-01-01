var datastore = require("./create-read-delete");

// Create data without TTL
datastore.createData("Foo", "Bar", "data.json");

// Read and display the value for the key "Foo" if it exists in the datastore
datastore.readData("Foo");

// Create data with TTL (5 seconds)
datastore.createData("Baz", "Qux", 5);

// Read data for the key "Baz" before expiry
datastore.readData("Baz");

// Read data for key "Baz" after expiry (should fail)
setTimeout(() => datastore.readData("Baz"), 6000);

// Create data without TTL
datastore.createData("Quux", "Quuz");

// Delete data using key "Quux"
datastore.deleteData("Quux");

// Read deleted data for the key "Quux" (should fail)
datastore.readData("Quux");





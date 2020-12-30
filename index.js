var datastore = require('./create-read-delete');

// Create data without TTL
datastore.createData("Foo", "Bar");

// Read data
datastore.readData("Foo");

// Create data with TTL (1 second)
datastore.createData("Baz", "Qux", 5);

// Read data before expiry
datastore.readData("Baz");

// Read expired data (should fail)
setTimeout(() => datastore.readData("Baz"), 6000);

// Create data without TTL
datastore.createData("Quux", "Quuz");

// Delete data using key
datastore.deleteData("Quux");

// Read deleted data (should fail)
datastore.readData("Quux");





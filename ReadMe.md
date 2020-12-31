# Key-Value Datastore

A file-based key-value datastore that supports basic CRD (create, read, delete) operations.

## Prerequisites

- Node version 14.x.x
- npm version 6.x.x

## Installation

### Clone the Repository

Create and navigate into a new directory anywhere on your file system through the command line. Then, run the following command.

```bash
git clone https://github.com/keerthisree-raghu/Datastore_CRD.git
```

### Install Requirements

Use the JavaScript package manager, [npm](https://www.npmjs.com/), to install the necessary dependencies to run this application.

```bash
npm install
```

## Usage

Import the 'create-read-delete.js' file into any JavaScript file and invoke the required methods with the specified parameters.

```js
var datastore = require('./create-read-delete.js');

// Create and write key-value pair data without time-to-live property
datastore.createData('key', 'value');

// Create and write key-value pair data with time-to-live property in seconds
datastore.createData('key', 'value', 3);

// Read and display the value corresponding to the given key
datastore.readData('key'); 

// Delete the key-value pair for the given key
datastore.deleteData('key');
```

## Execution

### Running the Application

To run the application, execute the file in which the methods were invoked. In this example, run the "app.js" file using the node command in the terminal.

```bash
node app.js
```

### Expected Output

```js
createData('Foo', 'Bar'); 
// "Foo": {"value": "Bar", "expiryTime": 0} is written to the JSON file

createData('Foo', 'Bar', 3); 
// "Foo": {"value": "Bar", "expiryTime": 0} is written to the JSON file
// The data will not be available to read or delete after 3 seconds

readData('Foo'); 
// { value: 'Bar', timeToLive: 0 } is displayed on the console

deleteData('Foo'); 
// If the key still exists, the key-value pair will be deleted
```

## Testing

The [Mocha](https://mochajs.org/) testing framework and [Chai](https://www.chaijs.com/) test assertion framework were used to write unit tests for this application. To run the tests, use the following command:

```bash
npm run test
```
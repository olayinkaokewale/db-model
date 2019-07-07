# DB Model for Express.js _(v 0.0.1)_
DB Model is a library for Express.js projects which would help in the elimination of SQL queries in codes (cleaner codes). 

It is basically an ORM (Object Relational Mapping) library limited to **MySQL** for now but plans are in place to extend to other SQL and NoSQL types in the future.

## Installation
Install via NPM using the command below:
> npm install db-model@latest

## Usage
Include this library into your project by importing or requiring it. Check the example below:

```js
const Model = require("db-model"); // If you're using Common JS model.
// OR
import Model from "db-model"; // If you're using Javascript import model.
```

Inside your model, you can decide to extend the model class to inherit the defined `CRUD` methods. Example below:

```js
class User extends Model {
    ...
    constructor() {
        const table = "user"; // <-- Name of the table to map to.
        const columns = {
            id: {type: "int", notNull: true},
            username: {type: "string", notNull: true},
            password: {type: "string", notNull: true},
            fullname: {type: "string", notNull: true}
        } // <-- Columns of the table.

        super(table, columns); // <-- Pass the table and columns into the parent class to register them.
    }
    ...
}
```

## Methods

- [create (async)](#create)
- [read (async)](#read)
- [update (async)](#update)
- [delete (async)](#delete)

### create


### read


### update


### delete

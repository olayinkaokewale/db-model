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

### create (async)
> create(hashmap={})

**create** method helps to insert new data into the database. See example on how it is used below:
```js
const user = new User(); // <-- This is the User model we created earlier.
const hashmap = {
    id: 1,
    username: "olayinkaokewale",
    password: "914b9c17b4ea373bc4981bbf867df186",
    fullname:"Olayinka Okewale"
}; // <-- This is the javascript object to use in creating the model.
user.create(hashmap)
    .then(data => { // <-- Returns promise with insert ID
        const insertId = data.insertId;
    })
    .catch(err => { // <-- Returns failed promise caught here.
        console.log(err); // <-- Log the error.
    });
```

### read (async)
> read(selectData=[], whereHashmap={}, orderList=[], limit=0, offset=0)

**read** method is used to get rows from the database. Note that this method uses the [whereHashMap](#wherehashmap) to build the query. Read more about it in [this section](#wherehashmap).

See example below:

 ```js
 const selectData = ["username", "id"]; // <-- Columns to select
 const whereHashmap = {
    _and: {
        username: "olayinkaokewale",
        password: "914b9c17b4ea373bc4981bbf867df186"
    }
 } // <-- Where hashmap to search with.
 const orderList = []; // <-- order list can be empty by default.
 const limit = 10; // <-- limit is the parameter used to set the maximum number of rows to be returned.
 const offset = 1; // <-- offset is used to set the starting position to start selecting data.


user.read(selectData, whereHashmap, orderList, limit, offset)
    .then(rows => { // <-- Promise returned rows of data. (Array)
        // Use the rows selected here.
    })
    .catch(err => { // <-- Promise rejected caught here.
        console.log(err); // <-- Always good to log error
    });
```
Read more about [whereHashmap here](#wherehashmap)

### update
> update(columnHashmap = {}, whereHashmap = {})

**update** method requires two parameters but can take more to form more complicated queries. See the example below:

```js
const columnHashmap = {
    fullname: "Okewale Olayinka",
    username: "okjool"
}; // <-- key:value columns hash to update
const whereHashmap = {
    _and: {
        username: "olayinkaokewale",
        password: "914b9c17b4ea373bc4981bbf867df186"
    }
}; // <-- where clause for update query.

user.update(columnHashmap, whereHashmap);
```

### delete
Coming soon.

## whereHashmap
This is an object that helps build where query for the data you are trying to retrieve using the model.

Below are the different use-cases:

### AND
SQL Query:
```sql
WHERE `username`='olayinkaokewale' AND `password`='914b9c17b4ea373bc4981bbf867df186'
```
DB-MODEL Equivalent:
```js
{
    _and: {
        username: "olayinkaokewale",
        password: "914b9c17b4ea373bc4981bbf867df186"
    }
}
```

### OR
SQL Query:
```sql
WHERE `username`='olayinkaokewale' OR `password`='914b9c17b4ea373bc4981bbf867df186'
```
DB-MODEL Equivalent:
```js
{
    _or: {
        username: "olayinkaokewale",
        password: "914b9c17b4ea373bc4981bbf867df186"
    }
}
```

### AND & OR Combination
The following use-cases show how AND & OR sql query can be used together.

SQL Query
```sql
WHERE (`username`='olayinkaokewale' OR `password`='914b9c17b4ea373bc4981bbf867df186') AND (`fullname`='Olayinka Okewale' OR `id`='1')
```

DB-MODEL Equivalent:
```js
{
    _and: {
        _or: [
            {
                username: "olayinkaokewale",
                password: "914b9c17b4ea373bc4981bbf867df186"
            },
            {
                fullname: "Olayinka Okewale",
                id: 1
            }
        ]
        
    }
}
```
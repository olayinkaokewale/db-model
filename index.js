const DBConfig = require('../configs/db_config'),
    mysql = require('promise-mysql'),
    sqlString = require('sqlstring');

const joinStr = { _and: "AND", _or: "OR" };

class Model {

    /**
     * This model class will contain the CRUD methods to be used in all other classes
     * extending this one.
     * @param {String} table name of the database table this model is associated with.
     * @param {Object} columns columns of the table that can be written to. e.g. {id:'int', username:'string'}
     */
    constructor(table, columns) {
        // Properties should be declared here.
        this.table = table;
        this.props = columns;
    }

    /**
     * Create the mysql escape string
     * Using sqlstring module from:
     * https://www.npmjs.com/package/sqlstring
     * @param {String} str The string to perform mysql escape on
     */
    escape(str) {
        return sqlString.escape(str);
    }

    /**
     * CREATE method of the CRUD
     * @param {Object} hashmap example: {username: "okjool", firstname: "Olayinka"}
     */
    async create(hashmap) {
        // Initialize the key and values array
        let keys = [],
            values = [];

        // Get all the keys inside hashmap in array form.
        const hashKey = Object.keys(hashmap);

        // Get all the values inside hashmap in array form.
        const hashVal = Object.values(hashmap);

        // Do a foreach to check if any of the key is in 
        Object.keys(hashKey).map(key => {
            if (this.props.hasOwnProperty(hashKey[key])) {
                keys.push(hashKey[key]);
                values.push(this.escape(hashVal[key]));
            }
        });

        // Build the query.
        let query = `INSERT INTO ${this.table} (${keys.join(",")}) VALUES (${values.join(",")})`;

		// Do the MySQL query.
		try {
			const db = await mysql.createConnection(DBConfig.config);
			let insert = db.query(query);
            db.end();
            return insert;
		} catch(err) {
            throw err;
        }
    }

    /**
     * READ method of the CRUD
     * @param {Array} selectList List of columns to select. An empty array will select all
     * @param {Object} whereHashmap example: {_and: {_or: {username: "okjool", email: "okjool2012[at]gmail.com"}, password: "123456"}}
     * 					Equivalent to: WHERE (username="okjool" OR email="okjool2012[at]gmail.com") AND password="123456"
     * @param {Array} orderList List of columns to order by. An empty array will exclude order from the query.
     * @param {Integer} limit The number of rows to pick. Default is 0 and that will set no limit.
     * @param {Integer} offset Where the row should start selecting from. Default is 0
     */
    async read(selectList = [], whereHashmap = {}, orderList = [], limit = 0, offset = 0) {
        let selectListQuery = (selectList.length == 0) ? "*" : selectList.join(",");
        let whereQuery = Model.whereBuilder(whereHashmap);
        let orderListQuery = (orderList.length == 0) ? "" : ` ORDER BY ${orderList.join(",")}`;
        let limitStr = (limit == 0) ? "" : ` LIMIT ${offset},${limit}`;

        let queryStr = `SELECT ${selectListQuery} FROM ${this.table}${whereQuery}${orderListQuery}${limitStr}`;
        // return queryStr; // For Test
        // Do the MySQL query.
        try {
            const db = await mysql.createConnection(DBConfig.config);
            const rows = await db.query(queryStr);
            db.end();
            return rows;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    /**
     * UPDATE method of the CRUD
	 * @param {Object} columnHashmap example: {username:'okjool', email:'okjool2012@gmail.com'}
	 * @param {Object} whereHashmap example: {_and: {_or: {username: "okjool", email: "okjool2012[at]gmail.com"}, password: "123456"}}
     * 					Equivalent to: WHERE (username="okjool" OR email="okjool2012[at]gmail.com") AND password="123456"
     */
    async update(columnHashmap = {}, whereHashmap = {}) {
		let columnMap = Model.hashMapBuilder(columnHashmap).join(",");
		let whereQuery = Model.whereBuilder(whereHashmap);
		let queryStr = `UPDATE ${this.table} SET ${columnMap}${whereQuery}`;
		console.log(queryStr);
		try {
			const db = await mysql.createConnection(DBConfig.config);
            const updateData = await db.query(queryStr);
            db.end();
            return updateData;
		} catch(err) {
			console.log(err);
			throw err;
		}
    }

    /**
     * DELETE method of the CRUD
     */
    delete() {
        
    }

    /**
     * MISCELLANEOUS METHODS 
     */

    /**
     * WHERE BUILDER METHOD TO BUILD WHERE STRING
     * @param {Object} whereHashmap the where object to convert into query string 
     */
    static whereBuilder(whereHashmap = {}) {
        let whereString = ""; //Initialized to empty string
        if (Object.entries(whereHashmap).length > 0) {
            whereString = ` WHERE ${Model.andOrBuilder(whereHashmap).join(" AND ")}`; //Preparing to add where arguments
        }
        return whereString;
    }

    /**
     * RECURSIVE MAP BUILDER
     * @param {Object} map the object containing the map
     */
    static andOrBuilder(map) {
        if (Object.entries(map).length == 0) return [];
        let list = [];
        Object.keys(map).map(key => {
            if (key == "_and" || key == "_or") {
                if (Array.isArray(map[key])) {
                    let mapList = map[key];
                    Object.keys(mapList).map(k => {
                        let data = (key == "_and") ? { _and: mapList[k] } : { _or: mapList[k] };
                        let x = Model.andOrBuilder(data).join(` ${joinStr[key]} `);
                        list.push(x);
                    });
                } else {
                    let s = Model.andOrBuilder(map[key]).join(` ${joinStr[key]} `);
                    list.push(`(${s})`);
                }
            } else {
				let assign = '=';
				let value = map[key];
				if (typeof value == 'object' && value.hasOwnProperty('_not')) {
					assign = '!=';
					value = value._not;
				}
                let s = `${key}${assign}"${value}"`;
                list.push(s);
            }
        });
        return list;
	}
	
	/**
	 * HASH MAP BUILDER TO EQUALS
	 * @param {Object} map object of mappings
	 */
	static hashMapBuilder(map) {
		let retArray = [];
		if (typeof map == 'object') {
			Object.keys(map).map(key => {
				let assign = '=';
				let value = map[key];
				if (typeof value == 'object' && value.hasOwnProperty('_not')) {
					assign = '!=';
					value = value._not;
				}
				retArray.push(`${key}${assign}"${value}"`);
			});
		}
		return retArray;
	}
}

module.exports = Model;
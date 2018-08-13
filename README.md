## json-aggregate
[![Build Status](https://travis-ci.org/salvadr/json-aggregate.svg?branch=master)](https://travis-ci.org/salvadr/json-aggregate)
### What is it?
**json-aggregate** is a javascript utility to perform aggregations on JSON-formatted data. It is inspired by the MongoDB Aggregation Framework, but in no way pretends to cover all its functionality.
### Why?
**json-aggregate** allows developers to perform aggregation queries on JSON data without the need to store it. Nowadays the average app sends/receives JSON from multiple sources/apis/etc., and this utility can help developers extract some insights from the data quickly, and without using a database engine.
### How to use
Install via npm / yarn:

    npm install json-aggregate
aggregate.js exports a *Collection* class which must be instantiated with the JSON data:

    const { Collection } = require('json-aggregate')

    const collection = new Collection(myJsonData)

### Documentation
Please check all the methods available as well as live examples in the [documentation](http://salvador.io/json-aggregate).
### License
[MIT](https://choosealicense.com/licenses/mit/)
### Contact
Salvador Navarrete Garcia
[salvador.io](http://salvador.io)

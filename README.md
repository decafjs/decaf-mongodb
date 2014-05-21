DecafJS MongoDB Module
======================

The MongoDB Module attempts to provide an interface to MongoDB databases that is as close to the
mongo shell JavaScript syntax as possible.

Rhino does not support Harmony Proxies, so it is not possible to implement db.dbname.method() without some
assist from the program.  The db.use() method determines what dbname (in db.dbname.method) values are valid.

For example, you will typically do something like:

```javascript
var MongoDB = require('MongoDB').MongoDB,
    db = new MongoDB('dbname');

db.use('collection1', 'collection2', 'collection3' ...);

db.collection1.method(...);
db.collection2.method(...);
db.collection3.method(...);

db.foo.method(...); // throws an error, 'foo' is undefined
```

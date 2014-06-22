/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 6/23/13
 * Time: 9:23 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

/*global decaf, exports, require, JSON: true */

importClass(com.mongodb.Mongo);
importClass(com.mongodb.jvm.BSON);

JSON = com.threecrickets.jvm.json.JSON;
JSON.implementation = new com.mongodb.jvm.MongoRhinoJsonImplementation();

decaf.extend(exports, {
    MongoDB: require('lib/MongoDB').MongoDB,
    Collection: require('lib/Collection').Collection,
    Cursor: require('lib/Cursor').Cursor,
    ObjectId: require('lib/ObjectId').ObjectId
});

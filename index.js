/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 6/23/13
 * Time: 9:23 AM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

/*global decaf, exports, require, JSON: true */


decaf.extend(exports, {
    MongoDB: require('lib/MongoDB').MongoDB,
    Collection: require('lib/Collection').Collection,
    Cursor: require('lib/Cursor').Cursor,
    ObjectId: require('lib/ObjectId').ObjectId
});

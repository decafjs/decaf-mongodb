/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 7/3/13
 * Time: 9:22 PM
 */

/** @module ObjectId */

"use strict";

/*global decaf, Packages */

/**
 *
 * @param s
 * @returns {*}
 * @constructor
 */
function ObjectId(s) {
    this.oid = s ? new Packages.org.bson.types.ObjectId(s) : new Packages.org.bson.types.ObjectId();
//    return String((s ? new Packages.org.bson.types.ObjectId(s) : new Packages.org.bson.types.ObjectId()).toString());
}
decaf.extend(ObjectId.prototype, {
    /**
     *
     * @returns {string}
     */
    get: function() {
        return Packages.org.bson.types.ObjectId.get().toString();
    },
    toString: function() {
        return this.oid.toString();
    },
    getTimestamp: function() {
        return new Date(this.oid.getTime());
    }
});

decaf.extend(exports, {
    ObjectId: ObjectId
});

/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 6/22/13
 * Time: 11:05 PM
 */

/** @module MongoDB */

/*global require, exports */
"use strict";

var {MongoClient} = Packages.com.mongodb,
    {Collection} = require('Collection');

var client = new MongoClient();

/**
 *
 * @param db
 * @constructor
 */
function MongoDB(db) {
    this.db = client.getDB(db);
    this.requestStarted = false;
//        this.db.getCollections().toArray().each(function(collection) {
//            this[collection] = new Collection(this.db.getCollection(collection);
//        })
}

/**
 *
 * @returns {Array}
 */
MongoDB.getDatabases = function () {
    return this.db.getDatabaseNames().toArray();
};
decaf.extend(MongoDB.prototype, {
    /**
     *
     */
    requestStart: function () {
        if (!this.requestStarted) {
            this.db.requestStart();
            this.requestStarted = true;
        }
    },

    /**
     *
     */
    requestDone: function () {
        if (this.requestStarted) {
            this.db.requestDone();
            this.requestStarted = false;
        }
    },

    /**
     *
     * @param username
     * @param password
     * @returns {*}
     */
    addUser: function (username, password) {
        return this.db.addUser(username, password);
    },

    /**
     *
     * @param username
     * @returns {*}
     */
    removeUser: function (username) {
        return this.db.removeUser(username);
    },

    /**
     *
     * @param username
     * @param password
     * @returns {*}
     */
    auth: function (username, password) {
        return this.db.authenticate(username, password);
    },

    /**
     *
     * @returns {Array}
     */
    getCollectionNames: function () {
        var ret = [];
        decaf.each(this.db.getCollectionNames().toArray(), function (name) {
            ret.push(name.toString());
        });
        return ret;
    },

    /**
     *
     * @param name
     * @param options
     * @returns {*|Packages.com.mongodb}
     */
    createCollection: function (name, options) {
        options = options || null;
        return this[name] || (this[name] = new Collection(this.db.createCollection(name, options)));
    },

    /**
     *
     * @param name
     * @returns {*|Packages.com.mongodb}
     */
    getCollection: function (name) {
        return this[name] || (this[name] = new Collection(this.db.getCollection(name)));
    },

    /**
     *
     */
    use: function () {
        for (var i = 0, len = arguments.length; i < len; i++) {
            var arg = arguments[i];
            this[arg] = this[arg] || new Collection(this.db.getCollection(arg));
        }
    },

    /**
     *
     * @param command
     * @returns {*}
     */
    runCommand: function (command) {
        return this.db.command(command);
    },

    /**
     *
     * @returns {*}
     */
    getStats: function () {
        return this.db.getStats();
    },

    /**
     *
     * @returns {*|string}
     */
    getName: function () {
        return this.db.getName();
    },

    /**
     *
     * @param state
     * @returns {*}
     */
    setReadOnly: function (state) {
        if (state === undefined) {
            state = true;
        }
        return this.db.setReadOnly(state);
    },

    /**
     *
     * @param name
     * @returns {*}
     */
    collectionExists: function (name) {
        return this.db.collectionExists(name);
    },

    /**
     *
     * @returns {*}
     */
    getLastError: function () {
        return this.db.getLastError();
    },

    /**
     *
     * @returns {*}
     */
    getPreviousError: function () {
        return this.db.getPreviousError();
    },

    /**
     *
     * @returns {*}
     */
    resetError: function () {
        return this.db.resetError();
    },

    /**
     *
     * @returns {*}
     */
    dropDatabase: function () {
        return this.db.dropDatabase();
    },

    /**
     *
     * @returns {*}
     */
    isAuthenticated: function () {
        return this.db.isAuthenticated();
    }
});

decaf.extend(exports, {
    MongoDB: MongoDB
});

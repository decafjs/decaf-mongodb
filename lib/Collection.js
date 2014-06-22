/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 6/23/13
 * Time: 9:30 AM
 * To change this template use File | Settings | File Templates.
 */

/** @module Collection */

/*global require, exports, Packages, toString */

/**
 * MongoDB Collection module
 */
"use strict";

var {BasicDBObject} = Packages.com.mongodb,
    {Cursor} = require('Cursor'),
    BSON = com.mongodb.jvm.BSON;

function serialize(o) {

    if (o === undefined) {
        return new BasicDBObject();
    }
    return BSON.to(o);

//    o = JSON.parse(JSON.stringify(o));
    if (toString.apply(o) === '[object Array]') {
        var a = [];
        decaf.each(o, function (oo) {
            a.push(new BasicDBObject(oo));
        });
        return a;
    }
    return new BasicDBObject(o);
}

/**
 *
 * @param handle
 * @constructor
 */
function Collection(handle) {
    this.handle = handle;
}

decaf.extend(Collection.prototype, {

    /**
     *
     * @param doc
     * @returns {*}
     */
    aggregate: function (doc) {
        return this.handle.aggregate(serialize(doc));
    },

    /**
     *
     * @param query
     * @returns {*}
     */
    count: function (query) {
        return query ? this.handle.count(serialize(query)) : this.handle.count();
    },

    /**
     *
     * @param keys
     * @param options
     * @returns {*}
     */
    createIndex: function (keys, options) {
        console.warn('Colleciton.createIndex is deprecated since version 1.8');
        return this.handle.createIndex(serialize(keys), serialize(options));
    },

    /**
     *
     * @param index
     * @returns {*}
     */
    getIndexStats: function (index) {
        return this.handle.getIndexStats(serialize(index));
    },

    /**
     *
     * @returns {Function|*|size|Number|Number|Number|string|string|InputStream.size|OutputStream.size|mimePart.size|number}
     */
    dataSize: function () {
        return this.handle.stats().size;
    },

    /**
     *
     * @param field
     * @param query
     * @returns {*}
     */
    distinct: function (field, query) {
        return query ? this.handle.distinct(field, serialize(query)) : this.handle.distinct(field);
    },

    /**
     *
     * @returns {*}
     */
    drop: function () {
        return this.handle.drop();
    },

    /**
     *
     * @returns {*}
     */
    dropIndexes: function () {
        return this.handle.dropIndexes();
    },

    /**
     *
     * @param keys
     * @param options
     * @returns {*}
     */
    ensureIndex: function (keys, options) {
        return options ? this.handle.ensureIndex(serialize(keys), serialize(options)) : this.handle.ensureIndex(serialize(keys));
    },

    /**
     *
     * @param o
     * @returns {*}
     */
    insert: function (o) {
        o = serialize(o);
        this.handle.insert(o);
        return BSON.from(o); // JSON.parse(o);
    },

    /**
     *
     * @param o
     * @param projection
     * @returns {Packages.com.mongodb}
     */
    find: function (o, projection) {
        return new Cursor(projection ? this.handle.find(serialize(o), serialize(projection)) : this.handle.find(serialize(o)));
    },

    /**
     *
     * @param o
     * @param projection
     * @returns {*}
     */
    findOne: function (o, projection) {
        var result = projection ? this.handle.findOne(serialize(o), serialize(projection)) : this.handle.findOne(serialize(o));
        if (!result) {
            return false;
        }
        return JSON.parse(result.toString());
    },

    /**
     *
     * @param config
     * @returns {*}
     */
    findAndModify: function (config) {
        var query = serialize(config.query),
            update = serialize(config.update),
            sort = config.sort ? serialize(config.sort) : null,
            fields = config.fields ? serialize(config.fields) : null;

        return this.handle.findAndModify(query, fields, sort, config.remove || false, update, config.new || false, config.upsert || false);
    },

    /**
     *
     * @returns {*}
     */
    getIndexes: function () {
        return this.handle.getIndexes();
    },

    /**
     *
     * @param doc
     * @returns {*}
     */
    group: function (doc) {
        return this.handle.group(serialize(doc));
    },

    /**
     *
     * @returns {*}
     */
    isCapped: function () {
        return this.handle.isCapped();
    },

    /**
     *
     * @returns {*}
     */
    mapReduce: function () {
        return this.handle.mapReduce(arguments);
    },

    /**
     *
     * @returns {*}
     */
    reIndex: function () {
        return this.handle.reIndex();
    },

    /**
     *
     * @param query
     * @returns {*}
     */
    remove: function (query) {
        return this.handle.remove(serialize(query));
    },

    /**
     *
     * @param target
     * @param dropTarget
     * @returns {*}
     */
    renameCollection: function (target, dropTarget) {
        return dropTarget ? this.handle.renameCollection(target, true) : this.handle.renameCollection(target);
    },

    /**
     *
     * @param o
     * @returns {*}
     */
    save: function (o) {
        return this.handle.save(serialize(o));
    },

    /**
     *
     * @param scale
     * @returns {*}
     */
    stats: function (scale) {
        return scale ? this.handle.stats(scale) : this.handle.stats();
    },

    /**
     *
     * @returns {Function}
     */
    storageSize: function () {
        return this.handle.stats().storageSize;
    },

    /**
     *
     * @returns {*}
     */
    totalSize: function () {
        var stats = this.stats();
        return stats.storageSize + stats.totalIndexSize;
    },

    /**
     *
     * @param query
     * @param update
     * @param options
     * @returns {*}
     */
    update: function (query, update, options) {
        options = options || {};
        return this.handle.update(serialize(query), serialize(update), options.upsert || false, options.multi || false);
    },

    /**
     *
     * @param full
     * @returns {*}
     */
    validate: function (full) {
        full = full || false;
        var db = this.handle.getDB(),
            name = this.handle.getName();

        return db.runCommand(serialize({ validate: name, full: full }));
    }

});

decaf.extend(exports, {
    Collection: Collection
});

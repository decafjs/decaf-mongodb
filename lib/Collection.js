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

var {BasicDBObject, BasicDBList} = Packages.com.mongodb,
    {Cursor} = require('Cursor');
//,
//    BSON = com.mongodb.jvm.BSON,
// JSON converstion with support for MongoDB extended notation
//    Json = com.threecrickets.jvm.json.JSON;

//com.threecrickets.jvm.json.JSON.implementation = new com.mongodb.jvm.rhino.MongoRhinoJsonImplementation()
//Json.implementation = new Packages.com.mongodb.jvm.rhino.MongoRhinoJsonImplementation();

//JSON = Json;

function serialize( o ) {
    var result,
        index = 0;

    if ( o === undefined ) {
        return new BasicDBObject();
    }
    else if (o instanceof Packages.org.bson.types.ObjectId) {
        return o;
    }
    else if ( decaf.isArray(o) ) {
        result = new BasicDBList();
        decaf.each(o, function( value ) {
            result.put(index++, serialize(value));
        });
        return result;
    }
    else if ( decaf.isObject(o) ) {
        result = new BasicDBObject();
        decaf.each(o, function( value, key ) {
            result.put(key, serialize(value));
        });
        return result;
    }
    else if ( decaf.isDate(o) ) {
        return new ISODate(o.getTime());
    }
    else if ( decaf.isString(o) ) {
        return String(o);
    }
    else {
        return o;
    }
}

function deserialize(o) {
    var result = {};

    decaf.each(o.entrySet().toArray(), function(elem) {
        var key = String(elem.getKey()),
            value = elem.getValue();
        debugger;
        if (value instanceof Packages.org.bson.types.ObjectId ) {
            result[key] = value;
        }
        else if (value.entrySet) {
            result[key] = deserialize(value);
        }
        else if (value.toArray) {
            result[key] = [];
            decaf.each(value.toArray(), function(value) {
                result[key].push(deserialize(value));
            });
        }
        else {
            result[key] = String(value.toString());
        }
    });
    return result;
}

/**
 *
 * @param handle
 * @constructor
 */
function Collection( handle ) {
    this.handle = handle;
}

decaf.extend(Collection.prototype, {

    /**
     *
     * @param doc
     * @returns {*}
     */
    aggregate : function( doc ) {
        return this.handle.aggregate(serialize(doc));
    },

    /**
     *
     * @param query
     * @returns {*}
     */
    count : function( query ) {
        return query ? this.handle.count(serialize(query)) : this.handle.count();
    },

    /**
     *
     * @param keys
     * @param options
     * @returns {*}
     */
    createIndex : function( keys, options ) {
        console.warn('Collection.createIndex is deprecated since version 1.8');
        return this.handle.createIndex(serialize(keys), serialize(options));
    },

    /**
     *
     * @param index
     * @returns {*}
     */
    getIndexStats : function( index ) {
        return this.handle.getIndexStats(serialize(index));
    },

    /**
     *
     * @returns {Function|*|size|Number|Number|Number|string|string|InputStream.size|OutputStream.size|mimePart.size|number}
     */
    dataSize : function() {
        return this.handle.stats().size;
    },

    /**
     *
     * @param field
     * @param query
     * @returns {*}
     */
    distinct : function( field, query ) {
        return query ? this.handle.distinct(field, serialize(query)) : this.handle.distinct(field);
    },

    /**
     *
     * @returns {*}
     */
    drop : function() {
        return this.handle.drop();
    },

    /**
     *
     * @returns {*}
     */
    dropIndexes : function() {
        return this.handle.dropIndexes();
    },

    /**
     *
     * @param keys
     * @param options
     * @returns {*}
     */
    ensureIndex : function( keys, options ) {
        if ( options ) {
            return this.handle.ensureIndex(serialize(keys), serialize(options));
        }
        else {
            return this.handle.ensureIndex(serialize(keys));
        }
    },

    /**
     *
     * @param o
     * @returns {*}
     */
    insert : function( o ) {
        var bson = serialize(o);
        var result = this.handle.insert(bson);
        return JSON.parse(result);
    },

    /**
     *
     * @param o
     * @param projection
     * @returns {Packages.com.mongodb}
     */
    find : function( o, projection ) {
        return new Cursor(projection ? this.handle.find(serialize(o), serialize(projection)) : this.handle.find(serialize(o)));
    },

    /**
     *
     * @param o
     * @param projection
     * @returns {*}
     */
    findOne : function( o, projection ) {
        var result = projection ? this.handle.findOne(serialize(o), serialize(projection)) : this.handle.findOne(serialize(o));
        if ( !result ) {
            return false;
        }
        return deserialize(result); // BSON.from(result); // (result.toString()); // JSON.parse(result.toString());
    },

    /**
     *
     * @param config
     * @returns {*}
     */
    findAndModify : function( config ) {
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
    getIndexes : function() {
        return this.handle.getIndexes();
    },

    /**
     *
     * @param doc
     * @returns {*}
     */
    group : function( doc ) {
        return this.handle.group(serialize(doc));
    },

    /**
     *
     * @returns {*}
     */
    isCapped : function() {
        return this.handle.isCapped();
    },

    /**
     *
     * @returns {*}
     */
    mapReduce : function() {
        return this.handle.mapReduce(arguments);
    },

    /**
     *
     * @returns {*}
     */
    reIndex : function() {
        return this.handle.reIndex();
    },

    /**
     *
     * @param query
     * @returns {*}
     */
    remove : function( query ) {
        return this.handle.remove(serialize(query));
    },

    /**
     *
     * @param target
     * @param dropTarget
     * @returns {*}
     */
    renameCollection : function( target, dropTarget ) {
        return dropTarget ? this.handle.renameCollection(target, true) : this.handle.renameCollection(target);
    },

    /**
     *
     * @param o
     * @returns {*}
     */
    save : function( o ) {
        return this.handle.save(serialize(o));
    },

    /**
     *
     * @param scale
     * @returns {*}
     */
    stats : function( scale ) {
        return scale ? this.handle.stats(scale) : this.handle.stats();
    },

    /**
     *
     * @returns {Function}
     */
    storageSize : function() {
        return this.handle.stats().storageSize;
    },

    /**
     *
     * @returns {*}
     */
    totalSize : function() {
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
    update : function( query, update, options ) {
        options = options || {};
        query = serialize(query);
        update = serialize(update);
        return this.handle.update(query, update, options.upsert || false, options.multi || false);
    },

    /**
     *
     * @param full
     * @returns {*}
     */
    validate : function( full ) {
        full = full || false;
        var db = this.handle.getDB(),
            name = this.handle.getName();

        return db.runCommand(serialize({ validate : name, full : full }));
    }

});

decaf.extend(exports, {
    Collection : Collection
});

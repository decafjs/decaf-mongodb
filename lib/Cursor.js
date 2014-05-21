/**
 * Created with JetBrains WebStorm.
 * User: mschwartz
 * Date: 6/23/13
 * Time: 12:38 PM
 * To change this template use File | Settings | File Templates.
 */

/** @module Cursor */

/*global require, exports, JSON */

"use strict";

var {BasicDBObject} = Packages.com.mongodb;

function serialize(o) {
    if (o === undefined) {
        return new BasicDBObject();
    }
    if (toString.apply(o) === '[object Array]') {
        var a = [];
        decaf.each(o, function (oo) {
            a.push(new BasicDBObject(oo));
        });
        return a;
    }
    return new BasicDBObject(o);
}

// DBQuery.Option.*

/**
 *
 * @param cursor
 * @constructor
 */
function Cursor(cursor) {
    this.cursor = cursor;
}

decaf.extend(Cursor.prototype, {
    /**
     *
     * @param option
     * @returns {*}
     */
    addOption: function (option) {
        this.cursor.addOption(option);
        return this;
    },

    /**
     *
     * @param size
     * @returns {*}
     */
    batchSize: function (size) {
        this.cursor.batchSize(size);
        return this;
    },

    /**
     *
     * @returns {*}
     */
    count: function () {
        return this.cursor.count();
    },

    /**
     *
     * @returns {*}
     */
    explain: function () {
        return this.cursor.explain();
    },

    /**
     *
     * @param index
     * @returns {*}
     */
    hint: function (index) {
        return this.cursor.hint(index);
    },

    /**
     *
     * @param fn
     * @returns {Array}
     */
    map: function (fn) {
        var result = [];
        while (this.hasNext()) {
            var next = this.next();
            if (next && fn(next)) {
                result.push(next);
            }
        }
        this.close();
        return result;
    },

    /**
     *
     * @param indexBounds
     * @returns {*}
     */
    max: function (indexBounds) {
        this.cursor.max(indexBounds);
        return this;
    },

    /**
     *
     * @param indexBounds
     * @returns {*}
     */
    min: function (indexBounds) {
        this.cursor.min(indexBounds);
        return this;
    },

    /**
     *
     * @returns {*}
     */
    objsLeftInBatch: function () {
        return this.cursor.objsLeftInBatch();
    },

    /**
     *
     * @param mode
     * @param tagSet
     */
    readPref: function (mode, tagSet) {
        this.cursor.readPref(mode, tagSet);
    },

    /**
     *
     * @returns {*}
     */
    showDiskLoc: function () {
        return this.cursor.showDiskLoc();
    },

    /**
     *
     * @returns {*|number}
     */
    size: function () {
        return this.cursor.size();
    },

    /**
     *
     * @returns {*}
     */
    snapshot: function () {
        this.cursor.snapshot();
        return this;
    },

    /**
     *
     * @param sort
     * @returns {*}
     */
    sort: function (sort) {
        this.cursor = this.cursor.sort(serialize(sort));
        return this;
    },

    /**
     *
     * @returns {Array}
     */
    toArray: function () {
        var a = [];
        while (this.cursor.hasNext()) {
            a.push(JSON.parse(this.cursor.next().toString()));
        }
        this.data = a;
        return a;
    },

    /**
     *
     * @param n
     * @returns {*}
     */
    skip: function (n) {
        this.cursor = this.cursor.skip(n);
        return this;
    },

    /**
     *
     * @param n
     * @returns {*}
     */
    limit: function (n) {
        this.cursor = this.cursor.limit(n);
        return this;
    },

    /**
     *
     * @returns {*}
     */
    hasNext: function () {
        var ret = this.cursor && this.cursor.hasNext();
        if (!ret) {
            this.close();
        }
        return ret;
    },

    /**
     *
     * @returns {*}
     */
    next: function () {
        var ret = this.cursor && this.cursor.next();
        if (ret) {
            ret = JSON.parse(ret.toString());
        }
        else {
            this.close();
        }
        return ret;
    },

    /**
     *
     * @param fn
     */
    forEach: function (fn) {
        if (!this.cursor) {
            return;
        }
        while (this.hasNext()) {
            var next = this.next();
            if (next) {
                fn(JSON.parse(next.toString()));
            }
        }
        this.close();
    },

    /**
     *
     */
    close: function () {
        if (this.cursor) {
            this.cursor.close();
        }
        this.cursor = null;
    }

});

decaf.extend(exports, {
    Cursor: Cursor
});

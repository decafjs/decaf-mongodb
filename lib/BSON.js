/**
 * Created with WebStorm.
 * User: mschwartz
 * Date: 6/25/14
 * Time: 4:49 PM
 */
var {BasicDBObject, BasicDBList} = Packages.com.mongodb;

function serialize( o ) {
    var result,
        index = 0;

    if ( o === undefined ) {
        return new BasicDBObject();
    }
    else if ( o instanceof Packages.org.bson.types.ObjectId ) {
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
            if ( value ) {
                result.put(key, serialize(value));
            }
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

function deserialize( o ) {
    var result = {};

    decaf.each(o.entrySet().toArray(), function( elem ) {
        var key = String(elem.getKey()),
            value = elem.getValue();

        if ( value instanceof Packages.org.bson.types.ObjectId ) {
            result[key] = value;
        }
        else if ( value instanceof java.util.Date ) {
            console.log('Date!');
            result[key] = new Date(value.getTime());
        }
        else if ( value.entrySet ) {
            result[key] = deserialize(value);
        }
        else if ( value.toArray ) {
            result[key] = [];
            decaf.each(value.toArray(), function( value ) {
                result[key].push(deserialize(value));
            });
        }
        else {
            result[key] = String(value.toString());
        }
    });
    return result;
}

decaf.extend(exports, {
    serialize: serialize,
    deserialize: deserialize
});

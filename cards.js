'use strict';

module.exports = function (context, cb) {
    console.log(context.data);
    return cb(null,{});
}
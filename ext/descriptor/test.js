/*eslint-disable no-console*/
"use strict";
var protobuf   = require("../../"),
    descriptor = require(".");

var proto = require("../../google/protobuf/descriptor.json")/*{
    nested: {
        Message: {
            fields: {
                foo: {
                    type: "string",
                    id: 1
                }
            },
            nested: {
                SubMessage: {
                    fields: {}
                }
            }
        },
        Enum: {
            values: {
                ONE: 1,
                TWO: 2
            }
        }
    }
}*/;

var root = protobuf.Root.fromJSON(proto).resolveAll();

// console.log("Original proto", JSON.stringify(root, null, 2));

var msg  = root.toDescriptor();

// console.log("\nDescriptor", JSON.stringify(msg.toObject(), null, 2));

var buf  = descriptor.FileDescriptorSet.encode(msg).finish();
var root2 = protobuf.Root.fromDescriptor(buf, "proto2").resolveAll();

// console.log("\nDecoded proto", JSON.stringify(root2, null, 2));

var diff = require("deep-diff").diff(root.toJSON(), root2.toJSON());
if (diff)
    diff.forEach(function(diff) {
        console.log(diff.kind + " @ " + diff.path.join("."));
        console.log("lhs:", diff.lhs);
        console.log("rhs:", diff.rhs);
        console.log();
    });
else
    console.log("no differences");

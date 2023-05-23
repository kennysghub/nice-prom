"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreetServiceDefinition = exports.GreetResponse = exports.GreetRequest = exports.protobufPackage = void 0;
var _m0 = require("protobufjs/minimal");
exports.protobufPackage = "test";
function createBaseGreetRequest() {
    return { Hello: "" };
}
exports.GreetRequest = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.Hello !== "") {
            writer.uint32(10).string(message.Hello);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = createBaseGreetRequest();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.Hello = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON: function (object) {
        return { Hello: isSet(object.Hello) ? String(object.Hello) : "" };
    },
    toJSON: function (message) {
        var obj = {};
        message.Hello !== undefined && (obj.Hello = message.Hello);
        return obj;
    },
    create: function (base) {
        return exports.GreetRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial: function (object) {
        var _a;
        var message = createBaseGreetRequest();
        message.Hello = (_a = object.Hello) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseGreetResponse() {
    return { Goodbye: "" };
}
exports.GreetResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.Goodbye !== "") {
            writer.uint32(10).string(message.Goodbye);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = createBaseGreetResponse();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.Goodbye = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON: function (object) {
        return { Goodbye: isSet(object.Goodbye) ? String(object.Goodbye) : "" };
    },
    toJSON: function (message) {
        var obj = {};
        message.Goodbye !== undefined && (obj.Goodbye = message.Goodbye);
        return obj;
    },
    create: function (base) {
        return exports.GreetResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial: function (object) {
        var _a;
        var message = createBaseGreetResponse();
        message.Goodbye = (_a = object.Goodbye) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
exports.GreetServiceDefinition = {
    name: "GreetService",
    fullName: "test.GreetService",
    methods: {
        greetings: {
            name: "Greetings",
            requestType: exports.GreetRequest,
            requestStream: false,
            responseType: exports.GreetResponse,
            responseStream: false,
            options: {},
        },
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}

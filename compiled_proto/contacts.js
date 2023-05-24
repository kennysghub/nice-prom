"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactServiceDefinition = exports.ContactList = exports.ContactRequest = exports.Empty = exports.ContactResponse = exports.protobufPackage = void 0;
/* eslint-disable */
var Long = require("long");
var _m0 = require("protobufjs/minimal");
exports.protobufPackage = "";
function createBaseContactResponse() {
    return { firstName: "", lastName: "", telNum: 0, email: "" };
}
exports.ContactResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.firstName !== "") {
            writer.uint32(10).string(message.firstName);
        }
        if (message.lastName !== "") {
            writer.uint32(18).string(message.lastName);
        }
        if (message.telNum !== 0) {
            writer.uint32(24).int64(message.telNum);
        }
        if (message.email !== "") {
            writer.uint32(34).string(message.email);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = createBaseContactResponse();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.firstName = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.lastName = reader.string();
                    continue;
                case 3:
                    if (tag !== 24) {
                        break;
                    }
                    message.telNum = longToNumber(reader.int64());
                    continue;
                case 4:
                    if (tag !== 34) {
                        break;
                    }
                    message.email = reader.string();
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
        return {
            firstName: isSet(object.firstName) ? String(object.firstName) : "",
            lastName: isSet(object.lastName) ? String(object.lastName) : "",
            telNum: isSet(object.telNum) ? Number(object.telNum) : 0,
            email: isSet(object.email) ? String(object.email) : "",
        };
    },
    toJSON: function (message) {
        var obj = {};
        message.firstName !== undefined && (obj.firstName = message.firstName);
        message.lastName !== undefined && (obj.lastName = message.lastName);
        message.telNum !== undefined && (obj.telNum = Math.round(message.telNum));
        message.email !== undefined && (obj.email = message.email);
        return obj;
    },
    create: function (base) {
        return exports.ContactResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial: function (object) {
        var _a, _b, _c, _d;
        var message = createBaseContactResponse();
        message.firstName = (_a = object.firstName) !== null && _a !== void 0 ? _a : "";
        message.lastName = (_b = object.lastName) !== null && _b !== void 0 ? _b : "";
        message.telNum = (_c = object.telNum) !== null && _c !== void 0 ? _c : 0;
        message.email = (_d = object.email) !== null && _d !== void 0 ? _d : "";
        return message;
    },
};
function createBaseEmpty() {
    return {};
}
exports.Empty = {
    encode: function (_, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = createBaseEmpty();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON: function (_) {
        return {};
    },
    toJSON: function (_) {
        var obj = {};
        return obj;
    },
    create: function (base) {
        return exports.Empty.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial: function (_) {
        var message = createBaseEmpty();
        return message;
    },
};
function createBaseContactRequest() {
    return { firstName: "", lastName: "" };
}
exports.ContactRequest = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        if (message.firstName !== "") {
            writer.uint32(10).string(message.firstName);
        }
        if (message.lastName !== "") {
            writer.uint32(18).string(message.lastName);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = createBaseContactRequest();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.firstName = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.lastName = reader.string();
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
        return {
            firstName: isSet(object.firstName) ? String(object.firstName) : "",
            lastName: isSet(object.lastName) ? String(object.lastName) : "",
        };
    },
    toJSON: function (message) {
        var obj = {};
        message.firstName !== undefined && (obj.firstName = message.firstName);
        message.lastName !== undefined && (obj.lastName = message.lastName);
        return obj;
    },
    create: function (base) {
        return exports.ContactRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial: function (object) {
        var _a, _b;
        var message = createBaseContactRequest();
        message.firstName = (_a = object.firstName) !== null && _a !== void 0 ? _a : "";
        message.lastName = (_b = object.lastName) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
function createBaseContactList() {
    return { contacts: [] };
}
exports.ContactList = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = _m0.Writer.create(); }
        for (var _i = 0, _a = message.contacts; _i < _a.length; _i++) {
            var v = _a[_i];
            exports.ContactResponse.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = createBaseContactList();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.contacts.push(exports.ContactResponse.decode(reader, reader.uint32()));
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
        return {
            contacts: Array.isArray(object === null || object === void 0 ? void 0 : object.contacts) ? object.contacts.map(function (e) { return exports.ContactResponse.fromJSON(e); }) : [],
        };
    },
    toJSON: function (message) {
        var obj = {};
        if (message.contacts) {
            obj.contacts = message.contacts.map(function (e) { return e ? exports.ContactResponse.toJSON(e) : undefined; });
        }
        else {
            obj.contacts = [];
        }
        return obj;
    },
    create: function (base) {
        return exports.ContactList.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial: function (object) {
        var _a;
        var message = createBaseContactList();
        message.contacts = ((_a = object.contacts) === null || _a === void 0 ? void 0 : _a.map(function (e) { return exports.ContactResponse.fromPartial(e); })) || [];
        return message;
    },
};
exports.ContactServiceDefinition = {
    name: "ContactService",
    fullName: "ContactService",
    methods: {
        getContact: {
            name: "GetContact",
            requestType: exports.ContactRequest,
            requestStream: false,
            responseType: exports.ContactResponse,
            responseStream: false,
            options: {},
        },
        getContactList: {
            name: "GetContactList",
            requestType: exports.Empty,
            requestStream: false,
            responseType: exports.ContactList,
            responseStream: false,
            options: {},
        },
        createContact: {
            name: "CreateContact",
            requestType: exports.ContactResponse,
            requestStream: false,
            responseType: exports.ContactResponse,
            responseStream: false,
            options: {},
        },
    },
};
var tsProtoGlobalThis = (function () {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    throw "Unable to locate global object";
})();
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
    }
    return long.toNumber();
}
// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
    _m0.util.Long = Long;
    _m0.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreetServiceDefinition = exports.GreetResponse = exports.GreetRequest = exports.protobufPackage = void 0;
const _m0 = __importStar(require("protobufjs"));
exports.protobufPackage = "test";
function createBaseGreetRequest() {
    return { Hello: "" };
}
exports.GreetRequest = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.Hello !== "") {
            writer.uint32(10).string(message.Hello);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGreetRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
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
    fromJSON(object) {
        return { Hello: isSet(object.Hello) ? String(object.Hello) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.Hello !== undefined && (obj.Hello = message.Hello);
        return obj;
    },
    create(base) {
        return exports.GreetRequest.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGreetRequest();
        message.Hello = (_a = object.Hello) !== null && _a !== void 0 ? _a : "";
        return message;
    },
};
function createBaseGreetResponse() {
    return { Goodbye: "" };
}
exports.GreetResponse = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.Goodbye !== "") {
            writer.uint32(10).string(message.Goodbye);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGreetResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
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
    fromJSON(object) {
        return { Goodbye: isSet(object.Goodbye) ? String(object.Goodbye) : "" };
    },
    toJSON(message) {
        const obj = {};
        message.Goodbye !== undefined && (obj.Goodbye = message.Goodbye);
        return obj;
    },
    create(base) {
        return exports.GreetResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a;
        const message = createBaseGreetResponse();
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

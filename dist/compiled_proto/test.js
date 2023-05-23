import * as _m0 from "protobufjs/minimal";
export const protobufPackage = "test";
function createBaseGreetRequest() {
    return { Hello: "" };
}
export const GreetRequest = {
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
        return GreetRequest.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseGreetRequest();
        message.Hello = object.Hello ?? "";
        return message;
    },
};
function createBaseGreetResponse() {
    return { Goodbye: "" };
}
export const GreetResponse = {
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
        return GreetResponse.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseGreetResponse();
        message.Goodbye = object.Goodbye ?? "";
        return message;
    },
};
export const GreetServiceDefinition = {
    name: "GreetService",
    fullName: "test.GreetService",
    methods: {
        greetings: {
            name: "Greetings",
            requestType: GreetRequest,
            requestStream: false,
            responseType: GreetResponse,
            responseStream: false,
            options: {},
        },
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}

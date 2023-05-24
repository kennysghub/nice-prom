/* eslint-disable */
import * as Long from "long";
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export interface ContactResponse {
  firstName: string;
  lastName: string;
  telNum: number;
  email: string;
}

export interface Empty {
}

export interface ContactRequest {
  firstName: string;
  lastName: string;
}

export interface ContactList {
  contacts: ContactResponse[];
}

function createBaseContactResponse(): ContactResponse {
  return { firstName: "", lastName: "", telNum: 0, email: "" };
}

export const ContactResponse = {
  encode(message: ContactResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
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

          message.telNum = longToNumber(reader.int64() as Long);
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

  fromJSON(object: any): ContactResponse {
    return {
      firstName: isSet(object.firstName) ? String(object.firstName) : "",
      lastName: isSet(object.lastName) ? String(object.lastName) : "",
      telNum: isSet(object.telNum) ? Number(object.telNum) : 0,
      email: isSet(object.email) ? String(object.email) : "",
    };
  },

  toJSON(message: ContactResponse): unknown {
    const obj: any = {};
    message.firstName !== undefined && (obj.firstName = message.firstName);
    message.lastName !== undefined && (obj.lastName = message.lastName);
    message.telNum !== undefined && (obj.telNum = Math.round(message.telNum));
    message.email !== undefined && (obj.email = message.email);
    return obj;
  },

  create(base?: DeepPartial<ContactResponse>): ContactResponse {
    return ContactResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ContactResponse>): ContactResponse {
    const message = createBaseContactResponse();
    message.firstName = object.firstName ?? "";
    message.lastName = object.lastName ?? "";
    message.telNum = object.telNum ?? 0;
    message.email = object.email ?? "";
    return message;
  },
};

function createBaseEmpty(): Empty {
  return {};
}

export const Empty = {
  encode(_: Empty, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Empty {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmpty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): Empty {
    return {};
  },

  toJSON(_: Empty): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<Empty>): Empty {
    return Empty.fromPartial(base ?? {});
  },

  fromPartial(_: DeepPartial<Empty>): Empty {
    const message = createBaseEmpty();
    return message;
  },
};

function createBaseContactRequest(): ContactRequest {
  return { firstName: "", lastName: "" };
}

export const ContactRequest = {
  encode(message: ContactRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.firstName !== "") {
      writer.uint32(10).string(message.firstName);
    }
    if (message.lastName !== "") {
      writer.uint32(18).string(message.lastName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
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

  fromJSON(object: any): ContactRequest {
    return {
      firstName: isSet(object.firstName) ? String(object.firstName) : "",
      lastName: isSet(object.lastName) ? String(object.lastName) : "",
    };
  },

  toJSON(message: ContactRequest): unknown {
    const obj: any = {};
    message.firstName !== undefined && (obj.firstName = message.firstName);
    message.lastName !== undefined && (obj.lastName = message.lastName);
    return obj;
  },

  create(base?: DeepPartial<ContactRequest>): ContactRequest {
    return ContactRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ContactRequest>): ContactRequest {
    const message = createBaseContactRequest();
    message.firstName = object.firstName ?? "";
    message.lastName = object.lastName ?? "";
    return message;
  },
};

function createBaseContactList(): ContactList {
  return { contacts: [] };
}

export const ContactList = {
  encode(message: ContactList, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.contacts) {
      ContactResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactList {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactList();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contacts.push(ContactResponse.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactList {
    return {
      contacts: Array.isArray(object?.contacts) ? object.contacts.map((e: any) => ContactResponse.fromJSON(e)) : [],
    };
  },

  toJSON(message: ContactList): unknown {
    const obj: any = {};
    if (message.contacts) {
      obj.contacts = message.contacts.map((e) => e ? ContactResponse.toJSON(e) : undefined);
    } else {
      obj.contacts = [];
    }
    return obj;
  },

  create(base?: DeepPartial<ContactList>): ContactList {
    return ContactList.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ContactList>): ContactList {
    const message = createBaseContactList();
    message.contacts = object.contacts?.map((e) => ContactResponse.fromPartial(e)) || [];
    return message;
  },
};

export type ContactServiceDefinition = typeof ContactServiceDefinition;
export const ContactServiceDefinition = {
  name: "ContactService",
  fullName: "ContactService",
  methods: {
    getContact: {
      name: "GetContact",
      requestType: ContactRequest,
      requestStream: false,
      responseType: ContactResponse,
      responseStream: false,
      options: {},
    },
    getContactList: {
      name: "GetContactList",
      requestType: Empty,
      requestStream: false,
      responseType: ContactList,
      responseStream: false,
      options: {},
    },
    createContact: {
      name: "CreateContact",
      requestType: ContactResponse,
      requestStream: false,
      responseType: ContactResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface ContactServiceImplementation<CallContextExt = {}> {
  getContact(request: ContactRequest, context: CallContext & CallContextExt): Promise<DeepPartial<ContactResponse>>;
  getContactList(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<ContactList>>;
  createContact(request: ContactResponse, context: CallContext & CallContextExt): Promise<DeepPartial<ContactResponse>>;
}

export interface ContactServiceClient<CallOptionsExt = {}> {
  getContact(request: DeepPartial<ContactRequest>, options?: CallOptions & CallOptionsExt): Promise<ContactResponse>;
  getContactList(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<ContactList>;
  createContact(
    request: DeepPartial<ContactResponse>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ContactResponse>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
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

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

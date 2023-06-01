"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergedRegistry = void 0;
const prom_client_1 = require("prom-client");
const nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
//const niceGrpcRegistry = niceGrpcClient.registry;
// const globalRegistry = register;
exports.mergedRegistry = prom_client_1.Registry.merge([prom_client_1.register, nice_grpc_prometheus_1.registry]);

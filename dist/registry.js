"use strict";
//require prom-client: prometheus for node.js that supports historgram, summaries, gauges and counters
//works with nice-grpc-prometheus
//const promClient = require('prom-client');
//globalRegistry is assinged to an instance of Registery
//onst globalRegistry= promClient.register;
//Registry is the class in prom-client (lambda Registry)
//const {Registry} = promClient;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergedRegistry = exports.niceGrpcRegistry = void 0;
// //require nice-grpc-prometheus
// const niceGrpcClient = require('nice-grpc-prometheus');
// const niceGrpcRegistry = niceGrpcClient.registry;
// //merge niceGrpcRegistry with global (use await to export all metrics)
// const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
// //export
// module.exports = mergedRegistry;
const prom_client_1 = require("prom-client");
const nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
exports.niceGrpcRegistry = nice_grpc_prometheus_1.registry;
exports.mergedRegistry = prom_client_1.Registry.merge([prom_client_1.register, exports.niceGrpcRegistry]);

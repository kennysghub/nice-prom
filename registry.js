"use strict";
//require prom-client: prometheus for node.js that supports historgram, summaries, gauges and counters
//works with nice-grpc-prometheus
//const promClient = require('prom-client');
//globalRegistry is assinged to an instance of Registery
//onst globalRegistry= promClient.register;
//Registry is the class in prom-client (lambda Registry)
//const {Registry} = promClient;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergedRegistry = void 0;
// //require nice-grpc-prometheus
// const niceGrpcClient = require('nice-grpc-prometheus');
// const niceGrpcRegistry = niceGrpcClient.registry;
// //merge niceGrpcRegistry with global (use await to export all metrics)
// const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
// //export
// module.exports = mergedRegistry;
var prom_client_1 = require("prom-client");
var nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
exports.mergedRegistry = prom_client_1.Registry.merge([prom_client_1.register, nice_grpc_prometheus_1.registry]);

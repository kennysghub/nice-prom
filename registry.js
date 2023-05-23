"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//require prom-client: prometheus for node.js that supports historgram, summaries, gauges and counters
//works with nice-grpc-prometheus
// import promClient from 'prom-client';
//globalRegistry is assinged to an instance of Registery
// const globalRegistry= promClient.register;
//Registry is the class in prom-client (lambda Registry)
var Registry = promClient.Registry;
// export default globalRegistry;
//console.log(`globalRegistry: ${globalRegistry}, Registry: ${Registry}`)
//require nice-grpc-prometheus
// import niceGrpcClient from 'nice-grpc-prometheus';
// const niceGrpcRegistry = niceGrpcClient.registry;
//merge niceGrpcRegistry with global (use await to export all metrics)
// export const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
//export
var promClient = require("prom-client");
var nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
var globalRegistry = promClient.register;
var mergedRegistry = promClient.Registry.merge([globalRegistry, nice_grpc_prometheus_1.registry]);
exports.default = mergedRegistry;

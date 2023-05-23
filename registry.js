"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergedRegistry = exports.niceGrpcRegistry = void 0;
//require prom-client: prometheus for node.js that supports historgram, summaries, gauges and counters
//works with nice-grpc-prometheus
var promClient = require("prom-client");
//globalRegistry is assinged to an instance of Registery
var globalRegistry = promClient.register;
//Registry is the class in prom-client (lambda Registry)
var Registry = promClient.Registry;
//console.log(`globalRegistry: ${globalRegistry}, Registry: ${Registry}`)
//require nice-grpc-prometheus
var niceGrpcClient = require("nice-grpc-prometheus");
exports.niceGrpcRegistry = niceGrpcClient.registry;
//merge niceGrpcRegistry with global (use await to export all metrics)
exports.mergedRegistry = Registry.merge([globalRegistry, exports.niceGrpcRegistry]);

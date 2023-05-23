"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergedRegistry = void 0;
var prom_client_1 = require("prom-client");
var nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
exports.mergedRegistry = prom_client_1.Registry.merge([prom_client_1.register, nice_grpc_prometheus_1.registry]);
exports.default = nice_grpc_prometheus_1.registry;

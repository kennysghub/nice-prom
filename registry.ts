//require prom-client: prometheus for node.js that supports historgram, summaries, gauges and counters
//works with nice-grpc-prometheus
//const promClient = require('prom-client');
//globalRegistry is assinged to an instance of Registery
//onst globalRegistry= promClient.register;
//Registry is the class in prom-client (lambda Registry)
//const {Registry} = promClient;

// //require nice-grpc-prometheus
// const niceGrpcClient = require('nice-grpc-prometheus');
// const niceGrpcRegistry = niceGrpcClient.registry;

// //merge niceGrpcRegistry with global (use await to export all metrics)
// const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);

// //export
// module.exports = mergedRegistry;


import {register as globalRegistry, Registry } from 'prom-client';
import {registry} from 'nice-grpc-prometheus';

export const niceGrpcRegistry = registry

export const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nice_grpc_1 = require("nice-grpc");
const nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
//import * as serverRegistry from './registry';
const test_1 = require("./compiled_proto/test");
const grpc_js_1 = require("@grpc/grpc-js");
const registry_1 = require("./registry");
const express_1 = __importDefault(require("express"));
const prom_client_1 = require("prom-client");
const app = (0, express_1.default)();
const port = 8000;
//
//
// const client = require('prom-client');
// const collectDefaultMetrics = client.collectDefaultMetrics;
const grpcRequestDurationHistogram = new prom_client_1.Histogram({
    name: 'grpc_request_duration_seconds',
    help: 'Duration of gRPC requests',
    labelNames: ['method'],
    buckets: [0.1, 0.5, 1, 5, 10],
});
(0, prom_client_1.collectDefaultMetrics)();
// const metrics = await aggregatorRegistry.clusterMetrics();
//       res.set('Content-Type', aggregatorRegistry.contentType);
//       res.send(metrics);
app.get('/metrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const metrics = await mergedRegistry.metrics()
    const hi = registry_1.mergedRegistry.metrics()
        .then(res => {
        console.log("Promise Chain 1: ", res);
    })
        .then(res => {
        console.log("Promise Chain 2:  ", res);
    })
        .then(res => {
        return res;
    });
    res.set('Content-Type', prom_client_1.register.contentType);
    const k = yield prom_client_1.register.metrics();
    console.log(k);
    console.log(JSON.stringify(prom_client_1.Gauge));
    console.log(prom_client_1.Histogram);
    const metrics = yield registry_1.mergedRegistry.metrics();
    console.log(hi);
    console.log(grpcRequestDurationHistogram);
    res.send(metrics);
}));
app.get('/metrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const metrics = yield registry_1.mergedRegistry.getMetricsAsJSON();
        res.set('Content-Type', registry_1.mergedRegistry.contentType);
        const something = yield registry_1.mergedRegistry.metrics();
        console.log("SOMETHINGGG: ", something);
        res.send(metrics);
    }
    catch (error) {
        console.error('Error retrieving metrics:', error);
        res.status(500).send('Error retrieving metrics');
    }
}));
app.listen(port, () => {
    console.log(`Prometheus metrics endpoint listening on port ${port}`);
});
// ... Code to start your RPC server
const GreetServiceImpl = {
    greetings(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = {
                    Goodbye: 'bye!',
                };
                return response;
            }
            catch (err) {
                console.error(err);
                throw new nice_grpc_1.ServerError(nice_grpc_1.Status.ABORTED, 'An error occurred');
            }
        });
    },
};
const server = (0, nice_grpc_1.createServer)();
server.use((0, nice_grpc_prometheus_1.prometheusServerMiddleware)());
server.add(test_1.GreetServiceDefinition, GreetServiceImpl);
server.listen('0.0.0.0:3500', grpc_js_1.ServerCredentials.createInsecure());

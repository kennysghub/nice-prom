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
const test_1 = require("./compiled_proto/test");
const prom_client_1 = require("prom-client");
// // use `await mergedRegistry.metrics()` to export all metrics
const express_1 = __importDefault(require("express"));
// const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
const registry_1 = require("./registry");
const channel = (0, nice_grpc_1.createChannel)('localhost:3500', nice_grpc_1.ChannelCredentials.createInsecure());
const registry = new prom_client_1.Registry();
(0, prom_client_1.collectDefaultMetrics)();
// Adding Counter to registry
const requestCounter = new prom_client_1.Counter({
    name: "grpc_client_requests_total",
    help: "Total number of gRPC client requests",
    labelNames: ["service", "method"],
    registers: [registry],
});
const clientLatencyHistogram = new prom_client_1.Histogram({
    name: "grpc_client_handling_seconds",
    help: "Histogram of response latency (seconds) of the gRPC until it is finished by the application.",
    labelNames: ["grpc_type", "grpc_service", "grpc_method", "grpc_path", "grpc_code"],
    registers: [registry],
});
const latencySummary = new prom_client_1.Summary({
    name: 'grpc_client_latency_percentiles',
    help: 'Latency percentiles of the gRPC requests',
    labelNames: ['grpc_service', 'grpc_method'],
    percentiles: [0.5, 0.9, 0.99],
    registers: [registry],
});
function runClient() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const request = { Hello: 'hi' };
            // const response:GreetResponse = await client.greetings({ Hello: 'hi' });
            const k = yield registry_1.mergedRegistry.metrics();
            // const u =  mergedRegistry.setDefaultLabels({
            //   service: 'test',
            //   method: 'greetings',  
            // })
            console.log(k);
            const z = registry_1.mergedRegistry.getSingleMetric("test");
            console.log(z);
            const kenny = yield registry.getMetricsAsJSON();
            console.log(kenny);
            // console.log(u)
            const start = process.hrtime();
            const response = yield client.greetings(request);
            const end = process.hrtime(start);
            console.log("KKKKKKK---> ", k);
            requestCounter.inc({ service: "test", method: "greetings" });
            // const response: GreetResponse = await client.greetings(request);
            console.log("RESPONSE_______________________________________");
            console.log('Response:', response);
            console.log(response.Goodbye);
            console.log("LATENCYYYYY_________________________________");
            const meow = latencySummary.observe(0.025);
            console.log(meow);
            //
            // Record the response latency in the client-side histogram
            clientLatencyHistogram.observe({ grpc_type: "unary", grpc_service: "test.GreetService", grpc_method: "Greetings", grpc_path: "/test.GreetService/Greetings", grpc_code: "OK" }, end[0] + end[1] / 1e9);
            console.log(clientLatencyHistogram.get());
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            channel.close();
            try {
                const metrics = yield registry_1.mergedRegistry.metrics();
                console.log(metrics);
            }
            catch (error) {
                console.log("ERROR RETREIVEING METRICS: ", error);
            }
        }
    });
}
const client = (0, nice_grpc_1.createClientFactory)()
    .use((0, nice_grpc_prometheus_1.prometheusClientMiddleware)())
    .create(test_1.GreetServiceDefinition, channel);
// Example function to record latency and trigger metrics
function processGRPCRequest(service, method, latency) {
    // Record latency in the histogram metric
    clientLatencyHistogram.labels(service, method).observe(latency);
    // Record latency in the summary metric
    latencySummary.labels(service, method).observe(latency);
}
runClient();
runClient();
runClient();
runClient();
runClient();
runClient();
runClient();
// processGRPCRequest('test.GreetService', 'Greetings',.5)
const app = (0, express_1.default)();
const port = 9090;
app.get('/metrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hi = yield registry_1.mergedRegistry.metrics();
    console.log(hi);
    res.send(hi);
}));
app.listen(port, () => console.log(`Listening on port ${port}`));
// import {
//   ChannelCredentials,
//   createClientFactory,
//   createChannel,
// } from "nice-grpc";
// import {
//   prometheusClientMiddleware,
//   prometheusServerMiddleware,
// } from "nice-grpc-prometheus";
// import {
//   GreetServiceClient,
//   GreetServiceDefinition,
//   GreetRequest,
//   GreetResponse,
// } from "./compiled_proto/test";
// import {
//   Counter,
//   Histogram,
//   Registry,
//   collectDefaultMetrics,
// } from "prom-client";
// // Create a Prometheus registry
// const registry = new Registry();
// // Create a counter metric for request count on the client side
// const clientRequestCounter = new Counter({
//   name: "grpc_client_requests_total",
//   help: "Total number of gRPC client requests",
//   labelNames: ["service", "method"],
//   registers: [registry],
// });
// // Create a counter metric for error count on the client side
// const clientErrorCounter = new Counter({
//   name: "grpc_client_errors_total",
//   help: "Total number of gRPC client errors",
//   labelNames: ["service", "method"],
//   registers: [registry],
// });
// // Create a histogram metric for response latency on the client side
// const clientLatencyHistogram = new Histogram({
//   name: "grpc_client_handling_seconds",
//   help: "Histogram of response latency (seconds) of the gRPC until it is finished by the application.",
//   labelNames: ["grpc_type", "grpc_service", "grpc_method", "grpc_path", "grpc_code"],
//   registers: [registry],
// });
// // Create a counter metric for request count on the server side
// const serverRequestCounter = new Counter({
//   name: "grpc_server_requests_total",
//   help: "Total number of gRPC server requests",
//   labelNames: ["service", "method"],
//   registers: [registry],
// });
// // Create a counter metric for error count on the server side
// const serverErrorCounter = new Counter({
//   name: "grpc_server_errors_total",
//   help: "Total number of gRPC server errors",
//   labelNames: ["service", "method"],
//   registers: [registry],
// });
// // Create a histogram metric for response latency on the server side
// const serverLatencyHistogram = new Histogram({
//   name: "grpc_server_handling_seconds",
//   help: "Histogram of response latency (seconds) of gRPC that had been application-level handled by the server.",
//   labelNames: ["grpc_type", "grpc_service", "grpc_method", "grpc_path", "grpc_code"],
//   registers: [registry],
// });
// // Register default metrics (e.g., process CPU, memory) with the registry
// collectDefaultMetrics({ register: registry });
// // Create a gRPC channel with the desired endpoint and credentials
// const channel = createChannel("localhost:3500", ChannelCredentials.createInsecure());
// async function runClient(): Promise<void> {
//   try {
//     // Create a gRPC client with the specified service definition and channel
//     const client = createClientFactory()
//       .use(prometheusClientMiddleware()) // Add Prometheus middleware to the client
//       .create(GreetServiceDefinition, channel);
//     // Make a gRPC call to the "greetings" method
//     const request: GreetRequest = { Hello: "hi" };
// const k = await mergedRegistry.metrics();
// console.log('k',k)
//     // Increment the request count metric on the client side
//     clientRequestCounter.inc({
//       service: "GreetService",
//       method: "Greetings",
//     });
//     const start = process.hrtime();
//     const response: GreetResponse = await client.greetings(request);
//     const end = process.hrtime(start);
//     console.log("Response:", response);
//     console.log(response.Goodbye);
//     // Record the response latency in the client-side histogram
//     clientLatencyHistogram.observe(
//       { grpc_type: "unary", grpc_service: "test.GreetService", grpc_method: "Greetings", grpc_path: "/test.GreetService/Greetings", grpc_code: "OK" },
//       end[0] + end[1] / 1e9
//     );
//     console.log(clientLatencyHistogram.get)
//     console.log(clientLatencyHistogram.startTimer())
//   } catch (error) {
//     console.error("Error:", error);
//     // Increment the error count metric on the client side
//     clientErrorCounter.inc({
//       service: "GreetService",
//       method: "Greetings",
//     });
//   } finally {
//     // Close the gRPC channel
//     channel.close();
//     // Log the metrics to the console
//   }
// }
// runClient();

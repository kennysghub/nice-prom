"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nice_grpc_1 = require("nice-grpc");
const nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
const test_1 = require("./compiled_proto/test");
const prom_client_1 = require("prom-client");
// const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
const registry_1 = require("./registry");
const channel = (0, nice_grpc_1.createChannel)('https://localhost:3500', nice_grpc_1.ChannelCredentials.createInsecure());
const registry = new prom_client_1.Registry();
(0, prom_client_1.collectDefaultMetrics)();
// !!!!! These are different constructors from <prom-client> !!!!!!!!!!!!!!
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
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
async function runClient() {
    try {
        const request = { Hello: 'hi' };
        //* Need the response and invoking the client line 
        const response = await client.greetings(request);
        requestCounter.inc({ service: "test", method: "greetings" });
        const clientLatencyHist = await clientLatencyHistogram.get();
        console.log("Client Latency Histogram:______________", clientLatencyHist);
        console.log('This is the response from inside client.ts runClient() Method:_____', response);
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        channel.close();
        try {
            const metrics = await registry_1.mergedRegistry.metrics();
            console.log("Await mergedRegistry.metrics()_____________", metrics);
        }
        catch (error) {
            console.log("ERROR RETREIVEING METRICS: ", error);
        }
    }
}
const client = (0, nice_grpc_1.createClientFactory)()
    .use((0, nice_grpc_prometheus_1.prometheusClientMiddleware)())
    .create(test_1.GreetServiceDefinition, channel);
runClient();

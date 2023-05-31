"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nice_grpc_1 = require("nice-grpc");
const nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
const test_1 = require("./compiled_proto/test");
const grpc_js_1 = require("@grpc/grpc-js");
const express_1 = __importDefault(require("express"));
const prom_client_1 = require("prom-client");
const common_1 = require("./common");
const app = (0, express_1.default)();
const port = 8080;
const prom_client_2 = require("prom-client");
const nice_grpc_prometheus_2 = require("nice-grpc-prometheus");
const mergedRegistry = prom_client_2.Registry.merge([nice_grpc_prometheus_2.registry, prom_client_2.register]);
;
const grpcRequestDurationHistogram = new prom_client_1.Histogram({
    name: 'grpc_request_duration_seconds',
    help: 'Duration of gRPC requests',
    labelNames: ['method'],
    buckets: [0.1, 0.5, 1, 5, 10],
});
// const grpcCounter = new Counter
const serverHandlingSecondsMetric = new prom_client_1.Histogram({
    registers: [mergedRegistry],
    name: 'grpc_server_handling_secondss',
    help: 'Histogram of response latency (seconds) of gRPC that had been application-level handled by the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel, common_1.codeLabel],
    buckets: common_1.latencySecondsBuckets,
});
const serverStartedMetric = new prom_client_1.Counter({
    registers: [mergedRegistry],
    name: 'grpc_server_started_totalsss',
    help: 'Total number of RPCs started on the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel],
});
const serverStreamMsgSentMetric = new prom_client_1.Counter({
    registers: [mergedRegistry],
    name: 'grpc_server_msg_sent_totalss',
    help: 'Total number of gRPC stream messages sent by the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel],
});
const registry1 = new prom_client_2.Registry();
const registry2 = new prom_client_2.Registry();
const metric1 = new prom_client_1.Gauge({ name: 'metric1', help: 'Metric 1' });
const metric2 = new prom_client_1.Gauge({ name: 'metric2', help: 'Metric 2' });
registry1.registerMetric(metric1);
registry2.registerMetric(metric2);
metric1.set(42);
metric2.set(3.14);
const mergedRegistry2 = prom_client_2.Registry.merge([registry1, registry2]);
let globalVar;
// Middleware to track request duration
app.use(async (req, res, next) => {
    const startTime = Date.now();
    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    console.log('rawr', grpcRequestDurationHistogram.observe({ method: 'unary' }, duration));
    const meow = await grpcRequestDurationHistogram.get();
    console.log('grpc-----', meow);
    const newMetric = await serverHandlingSecondsMetric.get();
    const severMsgSentMetric = await serverStreamMsgSentMetric.get();
    console.log("serverMsgSentMetric: ", severMsgSentMetric);
    console.log(newMetric);
    next();
});
app.use(async (req, res, next) => {
    res.set('Content-Type', mergedRegistry.contentType);
    try {
        const metrics = await mergedRegistry.metrics();
        console.log(metrics);
        const metrics2 = await mergedRegistry2.metrics();
        console.log('Guage Metrics: ____________________', metrics2);
        const startTime = Date.now();
        const duration = (Date.now() - startTime) / 1000; // Convert to seconds
        console.log('rawr', grpcRequestDurationHistogram.observe({ method: req.method }, duration));
        const newMetric = await serverHandlingSecondsMetric.get();
        serverStreamMsgSentMetric.get().then(res => console.log(res));
        const k = serverStreamMsgSentMetric.labels('typeLabel', 'serviceLabel', 'methodLabel', 'pathLabel');
        console.log(k);
        console.log(newMetric);
        console.log(metrics);
        next();
    }
    catch (err) {
        console.log('Error', err);
    }
});
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prom_client_1.register.contentType);
    res.send(await prom_client_1.register.metrics());
});
app.listen(port, () => {
    console.log(`Prometheus metrics endpoint listening on port ${port}`);
});
// ... Code to start your RPC server
const GreetServiceImpl = {
    async greetings(request) {
        try {
            const response = {
                Goodbye: 'bye!',
            };
            const mergedRMetrics = await mergedRegistry.metrics();
            console.log("LOOK______________");
            console.log("Request: ", request);
            console.log(mergedRMetrics);
            console.log("Response: ", response);
            return response;
        }
        catch (err) {
            console.error(err);
            throw new nice_grpc_1.ServerError(nice_grpc_1.Status.ABORTED, 'An error occurred');
        }
    },
};
//   // Add the server reflection implementation
// const serverReflectionImpl: ServerReflectionImplementation = {
//   async ServerReflectionInfo(
//     call: proto.Greetings.ServerReflectionInfoCall,
//   ): Promise<void> {
//     // Implement the logic to handle server reflection requests
//     // You can use `call.request` to access the request details
//     // And `call.write` to send back the response
//   },
// };
const server = (0, nice_grpc_1.createServer)();
server.use((0, nice_grpc_prometheus_1.prometheusServerMiddleware)());
server.add(test_1.GreetServiceDefinition, GreetServiceImpl);
server.listen('0.0.0.0:3500', grpc_js_1.ServerCredentials.createInsecure());

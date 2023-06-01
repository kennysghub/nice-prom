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
// !! collectDefaultMetrics() => Includes node metrics by default.
// !! Need to check if it includes any gRPC metrics that we need. 
// Merge Registrys 
// const registry = new Registry()
// const mergedRegistry = Registry.merge([ niceGrpcRegistry,globalRegistry]);
const registry_1 = require("./registry");
// Metric Constructors 
const grpcRequestDurationHistogram = new prom_client_1.Histogram({
    registers: [registry_1.mergedRegistry],
    name: 'grpc_request_duration_seconds',
    help: 'Duration of gRPC requests',
    labelNames: ['method'],
    buckets: [0.1, 0.5, 1, 5, 10],
});
const serverHandlingSecondsMetric = new prom_client_1.Histogram({
    registers: [registry_1.mergedRegistry],
    name: 'grpc_server_handling_secondss',
    help: 'Histogram of response latency (seconds) of gRPC that had been application-level handled by the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel, common_1.codeLabel],
    buckets: common_1.latencySecondsBuckets,
});
const serverStartedMetric = new prom_client_1.Counter({
    registers: [registry_1.mergedRegistry],
    name: 'grpc_server_started_totalsss',
    help: 'Total number of RPCs started on the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel],
});
const serverStreamMsgSentMetric = new prom_client_1.Counter({
    registers: [registry_1.mergedRegistry],
    name: 'grpc_server_msg_sent_totalss',
    help: 'Total number of gRPC stream messages sent by the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel],
});
// const registry1 = new Registry();
// const registry2 = new Registry();
// const metric1 = new Gauge({ name: 'metric1', help: 'Metric 1' });
// const metric2 = new Gauge({ name: 'metric2', help: 'Metric 2' });
// registry1.registerMetric(metric1);
// registry2.registerMetric(metric2)
// metric1.set(42);
// metric2.set(3.14);
// const mergedRegistry2 = Registry.merge([registry1,registry2])
// Middleware to track request duration`
// =================== EXPRESS ROUTE FOR PROMETHEUS PULLING METRICS =============
const app = (0, express_1.default)();
const port = 9100;
app.use(async (req, res, next) => {
    const startTime = Date.now();
    const duration = (Date.now() - startTime) / 1000;
    console.log('grpcRequestDurationHistogram Observe: ', grpcRequestDurationHistogram.observe({ method: req.method }, duration));
    const grpcReqDurationHist = await grpcRequestDurationHistogram.get();
    const grpcReqLabels = grpcRequestDurationHistogram.labels('method');
    // Start timer
    const start = grpcReqLabels.startTimer();
    console.log(start());
    console.log("GrpcReqLabels: ", grpcReqLabels);
    console.log('grpcRequestDurationHistogram.get() Method: ', grpcReqDurationHist);
    const newMetric = await serverHandlingSecondsMetric.get();
    const severMsgSentMetric = await serverStreamMsgSentMetric.get();
    console.log("serverMsgSentMetric: ", severMsgSentMetric);
    console.log(newMetric);
    next();
});
app.use(async (req, res, next) => {
    res.set('Content-Type', registry_1.mergedRegistry.contentType);
    try {
        const metrics = await registry_1.mergedRegistry.metrics();
        console.log("In Express, awaiting mergedRegistry.metrics() : __________", metrics);
        // const metrics2 = await mergedRegistry2.metrics();
        // console.log('Guage Metrics: ____________________',metrics2);
        const startTime = Date.now();
        const duration = (Date.now() - startTime) / 1000; // Convert to seconds
        console.log('grpcRequestDurationHistogram Observe Method: _____________', grpcRequestDurationHistogram.observe({ method: 'unary' }, duration));
        const newMetric = serverHandlingSecondsMetric.observe(5);
        serverStreamMsgSentMetric.get().then(res => console.log(res));
        const servStartedMetric = await serverStartedMetric.get();
        serverStartedMetric.inc();
        serverStartedMetric.labels('typeLabel', 'serviceLabel', 'methodLabel', 'pathLabel');
        console.log('awaiting servStartedMetric.get() Method: ', servStartedMetric);
        const servStrmSentMet = serverStreamMsgSentMetric.labels('typeLabel', 'serviceLabel', 'methodLabel', 'pathLabel');
        console.log("serverStreeamMsgSentMetric.labels() Method: _________", servStrmSentMet);
        console.log(newMetric);
        console.log(metrics);
        next();
    }
    catch (err) {
        console.log('Error', err);
    }
});
// EXPRESS FOR REACT 
//
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prom_client_1.register.contentType);
    console.log("Inside /metrics route :____________________________");
    res.end(await registry_1.mergedRegistry.metrics());
});
app.listen(port, () => {
    console.log(`Prometheus metrics endpoint listening on port ${port}`);
});
/* =============================== */
const GreetServiceImpl = {
    async greetings(request) {
        try {
            const response = {
                Goodbye: 'bye!',
            };
            const mergedRMetrics = await registry_1.mergedRegistry.metrics();
            console.log("Request From greetings :_______", request);
            console.log("Inside GreetServiceImpl: awaiting mergedRegistry.metrics()______", mergedRMetrics);
            console.log('gRPC Req Dur Histogram: _______', grpcRequestDurationHistogram.observe(1));
            serverHandlingSecondsMetric.observe(2);
            const histogramSeconds = await serverHandlingSecondsMetric.get();
            console.log('HISTOGRAM SECONDS _______', histogramSeconds);
            console.log("Response: ", response);
            return response;
        }
        catch (err) {
            console.error(err);
            throw new nice_grpc_1.ServerError(nice_grpc_1.Status.ABORTED, 'An error occurred');
        }
    },
};
/* ========== Start gRPC Server ===========*/
const server = (0, nice_grpc_1.createServer)();
server.use((0, nice_grpc_prometheus_1.prometheusServerMiddleware)());
server.add(test_1.GreetServiceDefinition, GreetServiceImpl);
server.listen('0.0.0.0:3500', grpc_js_1.ServerCredentials.createInsecure());
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

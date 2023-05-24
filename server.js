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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var nice_grpc_1 = require("nice-grpc");
var nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
var registry_1 = require("./registry");
var registry_2 = require("./registry");
var test_1 = require("./compiled_proto/test");
var grpc_js_1 = require("@grpc/grpc-js");
var prom_client_1 = require("prom-client");
// Define the metrics
var counterStartedTotal = new prom_client_1.Counter({
    name: 'grpc_server_started_total',
    help: 'Total number of RPCs started on the server',
});
var counterHandledTotal = new prom_client_1.Counter({
    name: 'grpc_server_handled_total',
    help: 'Total number of RPCs completed on the server, regardless of success or failure',
});
// GreetService Impl object is defined with an `async` keyword, indiciating that it returns a -> PROMISE. 
var histogramHandlingSeconds = new prom_client_1.Histogram({
    name: 'grpc_server_handling_seconds',
    help: 'Histogram of response latency (seconds) of gRPC that had been application-level handled by the server',
    buckets: [0.1, 0.5, 1, 2, 5],
});
// Make sure the `greetings` method is using the -> promise-based approach instead of the callback approach. 
var GreetServiceImpl = {
    greetings: function (request, context) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                try {
                    response = {
                        Goodbye: 'bye!',
                    };
                    counterStartedTotal.inc();
                    counterHandledTotal.inc();
                    console.log('histogram---', histogramHandlingSeconds);
                    console.log(prom_client_1.Histogram);
                    console.log(counterStartedTotal);
                    console.log(counterHandledTotal);
                    counterStartedTotal.inc();
                    // Your gRPC server logic here
                    counterHandledTotal.inc();
                    counterHandledTotal.inc();
                    counterHandledTotal.inc();
                    counterHandledTotal.inc();
                    counterHandledTotal.inc();
                    console.log('look---->', counterHandledTotal);
                    // Start measuring the response handling time
                    counterHandledTotal.inc();
                    return [2 /*return*/, response];
                }
                catch (err) {
                    console.error(err);
                    throw new nice_grpc_1.ServerError(nice_grpc_1.Status.ABORTED, 'An error occurred');
                }
                return [2 /*return*/];
            });
        });
    },
};
var allMetrics = function () { return __awaiter(void 0, void 0, void 0, function () {
    var getMetrics_1, metrics_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                getMetrics_1 = registry_1.default.metrics();
                return [4 /*yield*/, getMetrics_1];
            case 1:
                metrics_1 = _a.sent();
                console.log(metrics_1);
                return [2 /*return*/, metrics_1];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
allMetrics();
var metrics = registry_1.default.metrics();
metrics.then(function (res) { return console.log(res); });
var server = (0, nice_grpc_1.createServer)();
server.use((0, nice_grpc_prometheus_1.prometheusServerMiddleware)());
server.add(test_1.GreetServiceDefinition, GreetServiceImpl);
function getMetrics() {
    registry_1.default.metrics()
        .then(function (result) { return console.log(result); })
        .then(function (res) { return registry_2.default.metrics; });
}
getMetrics();
server.listen('127.0.0.1:3500', grpc_js_1.ServerCredentials.createInsecure());

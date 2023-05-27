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
const registry_1 = require("./registry");
const test_1 = require("./compiled_proto/test");
const grpc_js_1 = require("@grpc/grpc-js");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 9090;
app.get('/metrics', (req, res) => {
    res.set('Content-Type', registry_1.mergedRegistry.contentType);
    res.send(registry_1.mergedRegistry.metrics().then(data => data));
});
//console.log(mergedRegistry.metrics());
app.listen(port, () => console.log(`listening on port:${port}`));
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
server.listen('127.0.0.1:3500', grpc_js_1.ServerCredentials.createInsecure());

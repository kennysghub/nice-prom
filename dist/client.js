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
Object.defineProperty(exports, "__esModule", { value: true });
const nice_grpc_1 = require("nice-grpc");
const nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
const test_1 = require("./compiled_proto/test");
// const app = express();
// const port = 9090;
// app.listen(port, () => console.log(`listening on port:${port}`))
const channel = (0, nice_grpc_1.createChannel)('localhost:3500', nice_grpc_1.ChannelCredentials.createInsecure());
const client = (0, nice_grpc_1.createClientFactory)()
    .use((0, nice_grpc_prometheus_1.prometheusClientMiddleware)())
    .create(test_1.GreetServiceDefinition, channel);
function runClient() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield client.greetings({ Hello: 'hi' });
            console.log('Response:', response);
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            channel.close();
        }
    });
}
runClient();
// app.get('/metrics', (req, res) => {
//   res.set('Content-Type', mergedRegistry.contentType);
//   res.send(mergedRegistry.metrics().then(data => data))
// })
// channel.close()

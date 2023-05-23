import { ChannelCredentials, createClientFactory, createChannel } from "nice-grpc";
import { prometheusClientMiddleware } from "nice-grpc-prometheus";
import { GreetServiceDefinition } from "./compiled_proto/test";
import { Histogram, collectDefaultMetrics, register } from 'prom-client';
// Enable default metric collection
console.log(collectDefaultMetrics());
//
// import { Histogram, register } from 'prom-client';
// import { registry as niceGrpcRegistry } from 'nice-grpc-prometheus';
// // Merge niceGrpcRegistry with the global registry
// const mergedRegistry = register.setDefaultRegistry(niceGrpcRegistry);
//
const channel = createChannel('localhost:3500', ChannelCredentials.createInsecure());
const client = createClientFactory()
    .use(prometheusClientMiddleware())
    .create(GreetServiceDefinition, channel);
async function runClient() {
    try {
        // Record the start time of the RPC call
        const startTime = Date.now();
        // Your gRPC client call code here
        // Record the end time of the RPC call
        const endTime = Date.now();
        // Calculate the duration of the RPC call
        const duration = endTime - startTime;
        const response = await client.greetings({ Hello: 'hi' });
        const histogram = new Histogram({
            name: 'grpc_client_request_duration',
            help: 'Duration of gRPC client requests',
            labelNames: ['service', 'method'],
            registers: [register],
        });
        console.log('Response:', response);
        histogram
            .labels('GreetService', 'greetings')
            .observe(duration);
        console.log(histogram);
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        channel.close();
    }
}
runClient();
// channel.close()
//# sourceMappingURL=client.js.map
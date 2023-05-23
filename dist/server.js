import { ServerError, Status, createServer } from 'nice-grpc';
import { prometheusServerMiddleware } from 'nice-grpc-prometheus';
import mergedRegistry from './registry';
import { GreetServiceDefinition } from './compiled_proto/test';
import { ServerCredentials } from '@grpc/grpc-js';
// GreetService Impl object is defined with an `async` keyword, indiciating that it returns a -> PROMISE. 
// Make sure the `greetings` method is using the -> promise-based approach instead of the callback approach. 
const GreetServiceImpl = {
    async greetings(request) {
        try {
            const response = {
                Goodbye: 'bye!',
            };
            return response;
        }
        catch (err) {
            console.error(err);
            throw new ServerError(Status.ABORTED, 'An error occurred');
        }
    },
};
const server = createServer();
server.use(prometheusServerMiddleware());
server.add(GreetServiceDefinition, GreetServiceImpl);
const allMetrics = async () => {
    const getMetrics = await mergedRegistry.metrics();
    console.log(getMetrics);
    return getMetrics;
};
const test = await allMetrics();
console.log();
server.listen('127.0.0.1:3500', ServerCredentials.createInsecure());

import { CallContext, ServerError, Status, createServer} from 'nice-grpc';
import {prometheusServerMiddleware} from 'nice-grpc-prometheus';
import mergedRegistry from './registry';
import niceGrpcRegistry from './registry';
import globalRegistry from './registry';
import { DeepPartial, GreetRequest, GreetResponse, GreetServiceDefinition, GreetServiceImplementation } from './compiled_proto/test'
import { ServerCredentials } from '@grpc/grpc-js';


// GreetService Impl object is defined with an `async` keyword, indiciating that it returns a -> PROMISE. 
// Make sure the `greetings` method is using the -> promise-based approach instead of the callback approach. 

const GreetServiceImpl: GreetServiceImplementation = {
  async greetings(request: GreetRequest,context?:CallContext): Promise<DeepPartial<GreetResponse>> {
    try {
      const response: GreetResponse = {
        Goodbye: 'bye!',
      };
      return response;
    } catch (err) {
      console.error(err);
      throw new ServerError(Status.ABORTED, 'An error occurred');
    }
  },
};
  

const server = createServer()
      server.use(prometheusServerMiddleware())
      server.add(GreetServiceDefinition, GreetServiceImpl)




mergedRegistry.metrics().then(data => console.log('merged:', data))
globalRegistry.metrics().then(data => console.log('global: ',data))
niceGrpcRegistry.metrics().then(data => console.log(`niceGrpc:`, data))

server.listen('127.0.0.1:3500', ServerCredentials.createInsecure())
import { CallContext, ServerError, Status, createServer} from 'nice-grpc';
import {prometheusServerMiddleware} from 'nice-grpc-prometheus';
import {mergedRegistry, niceGrpcRegistry} from './registry';
import { DeepPartial, GreetRequest, GreetResponse, GreetServiceDefinition, GreetServiceImplementation } from './compiled_proto/test'
import { ServerCredentials } from '@grpc/grpc-js';



const GreetServiceImpl: GreetServiceImplementation = {
    async greetings(request: GreetRequest): Promise<DeepPartial<GreetResponse>> {
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
  
await mergedRegistry.metrics();

const serverStarted = niceGrpcRegistry

const server = createServer()
server.use(prometheusServerMiddleware())
    server.add(GreetServiceDefinition, GreetServiceImpl)

server.listen('127.0.0.1:3500', ServerCredentials.createInsecure())
import { CallContext, ServerError, Status, createServer} from 'nice-grpc';
import {prometheusServerMiddleware} from 'nice-grpc-prometheus';
//import * as serverRegistry from './registry';
import { DeepPartial, GreetRequest, GreetResponse, GreetServiceDefinition, GreetServiceImplementation } from './compiled_proto/test'
import { ServerCredentials } from '@grpc/grpc-js';
import mergedRegistry from './registry';
import { Counter, Histogram } from 'prom-client';

// Define the metrics
const counterStartedTotal = new Counter({
  name: 'grpc_server_started_total',
  help: 'Total number of RPCs started on the server',
});

const counterHandledTotal = new  Counter({
  name: 'grpc_server_handled_total',
  help: 'Total number of RPCs completed on the server, regardless of success or failure',
});
// GreetService Impl object is defined with an `async` keyword, indiciating that it returns a -> PROMISE. 
const histogramHandlingSeconds = new Histogram({
    name: 'grpc_server_handling_seconds',
    help: 'Histogram of response latency (seconds) of gRPC that had been application-level handled by the server',
    buckets: [0.1, 0.5, 1, 2, 5],
  });
// Make sure the `greetings` method is using the -> promise-based approach instead of the callback approach. 

const GreetServiceImpl: GreetServiceImplementation = {
    async greetings(request: GreetRequest,context:CallContext): Promise<DeepPartial<GreetResponse>> {
      try {
        const response: GreetResponse = {
          Goodbye: 'bye!',
        };
        counterStartedTotal.inc();
        counterHandledTotal.inc();
        console.log('histogram---', histogramHandlingSeconds)
        console.log
        console.log(counterStartedTotal)
        console.log(counterHandledTotal)
        counterStartedTotal.inc();
    // Your gRPC server logic here
    counterHandledTotal.inc();
    counterHandledTotal.inc();
    counterHandledTotal.inc();
    counterHandledTotal.inc();
    counterHandledTotal.inc();
    console.log('look---->', counterHandledTotal)

    // Start measuring the response handling time
    counterHandledTotal.inc();
        return response;
      } catch (err) {
        console.error(err);
        throw new ServerError(Status.ABORTED, 'An error occurred');
      }
    },
  };
  
  const allMetrics = async () => {
    try {
      const getMetrics = mergedRegistry.metrics();
      const metrics = await getMetrics;
      console.log(metrics);
    
      return metrics;
    } catch (error) {
      console.log(error);
    }
  };
  
  allMetrics();

const metrics =  mergedRegistry.metrics();
metrics.then(res => console.log("RES--------> ", res))

  
const server = createServer()
server.use(prometheusServerMiddleware())
    server.add(GreetServiceDefinition, GreetServiceImpl)


server.listen('127.0.0.1:3500', ServerCredentials.createInsecure())
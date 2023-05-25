import { CallContext, ServerError, Status, createServer} from 'nice-grpc';
import {prometheusServerMiddleware} from 'nice-grpc-prometheus';
//import * as serverRegistry from './registry';
import { DeepPartial, GreetRequest, GreetResponse, GreetServiceDefinition, GreetServiceImplementation } from './compiled_proto/test'
import { ServerCredentials } from '@grpc/grpc-js';
import {mergedRegistry} from './registry';
import express,{Express,Request,Response} from 'express';
import { register,Counter,Gauge, Histogram,collectDefaultMetrics } from 'prom-client';

const app = express();
const port = 8000;
//

//
// const client = require('prom-client');

// const collectDefaultMetrics = client.collectDefaultMetrics;
const grpcRequestDurationHistogram = new Histogram({
  name: 'grpc_request_duration_seconds',
  help: 'Duration of gRPC requests',
  labelNames: ['method'],
  buckets: [0.1, 0.5, 1, 5, 10],
});



collectDefaultMetrics();
// const metrics = await aggregatorRegistry.clusterMetrics();
//       res.set('Content-Type', aggregatorRegistry.contentType);
//       res.send(metrics);
app.get('/metrics', async (req:Request, res:Response) => {
  // const metrics = await mergedRegistry.metrics()
  const hi = mergedRegistry.metrics()
    .then(res => {
      console.log("Promise Chain 1: ", res)
    })
    .then(res => {
      console.log("Promise Chain 2:  ",res)
    })
    .then(res => {
      return res;
    })
    
    

  res.set('Content-Type', register.contentType);
  const k  = await register.metrics();
  console.log(k)
  console.log(JSON.stringify(Gauge));
  console.log(Histogram)
  const metrics = await mergedRegistry.metrics()
  console.log(hi)
  console.log(grpcRequestDurationHistogram)
  res.send(metrics);
});
app.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = await mergedRegistry.getMetricsAsJSON();
    res.set('Content-Type', mergedRegistry.contentType);
    const something = await mergedRegistry.metrics();
    console.log("SOMETHINGGG: ", something);
    res.send(metrics);
  } catch (error) {
    console.error('Error retrieving metrics:', error);
    res.status(500).send('Error retrieving metrics');
  }
});

app.listen(port, () => {
  console.log(`Prometheus metrics endpoint listening on port ${port}`);
});
// ... Code to start your RPC server


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
  

const server = createServer()
server.use(prometheusServerMiddleware())
    server.add(GreetServiceDefinition, GreetServiceImpl)
    


server.listen('0.0.0.0:3500', ServerCredentials.createInsecure())
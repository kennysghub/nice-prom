import { CallContext, ServerError, Status, createServer,} from 'nice-grpc';

import {prometheusServerMiddleware} from 'nice-grpc-prometheus';
import { DeepPartial, GreetRequest, GreetResponse, GreetServiceDefinition, GreetServiceImplementation } from './compiled_proto/test'
import { ServerCredentials } from '@grpc/grpc-js';

import express,{Express,Request,Response} from 'express';
import { register,Counter,Gauge, Histogram,collectDefaultMetrics } from 'prom-client';
import {
  codeLabel,
  getLabels,
  incrementStreamMessagesCounter,
  latencySecondsBuckets,
  methodLabel,
  pathLabel,
  serviceLabel,
  typeLabel,
} from './common'
const app = express();
const port = 8080;


import {register as globalRegistry, Registry } from 'prom-client';
import {registry as niceGrpcRegistry} from 'nice-grpc-prometheus';

 const mergedRegistry = Registry.merge([ niceGrpcRegistry,globalRegistry]);
;
const grpcRequestDurationHistogram = new Histogram({
  name: 'grpc_request_duration_seconds',
  help: 'Duration of gRPC requests',
  labelNames: ['method'],
  buckets: [0.1, 0.5, 1, 5, 10],
});
// const grpcCounter = new Counter
const serverHandlingSecondsMetric = new Histogram({
  registers: [mergedRegistry],
  name: 'grpc_server_handling_secondss',
  help: 'Histogram of response latency (seconds) of gRPC that had been application-level handled by the server.',
  labelNames: [typeLabel, serviceLabel, methodLabel, pathLabel, codeLabel],
  buckets: latencySecondsBuckets,
});


const serverStartedMetric = new Counter({
  registers: [mergedRegistry],
  name: 'grpc_server_started_totalsss',
  help: 'Total number of RPCs started on the server.',
  labelNames: [typeLabel, serviceLabel, methodLabel, pathLabel],
});



const serverStreamMsgSentMetric = new Counter({
  registers: [mergedRegistry],
  name: 'grpc_server_msg_sent_totalss',
  help: 'Total number of gRPC stream messages sent by the server.',
  labelNames: [typeLabel, serviceLabel, methodLabel, pathLabel],
});


const registry1 = new Registry();
const registry2 = new Registry();
const metric1 = new Gauge({ name: 'metric1', help: 'Metric 1' });
const metric2 = new Gauge({ name: 'metric2', help: 'Metric 2' });
registry1.registerMetric(metric1);
registry2.registerMetric(metric2)
metric1.set(42);
metric2.set(3.14);
const mergedRegistry2 = Registry.merge([registry1,registry2])

let globalVar:any;

// Middleware to track request duration
app.use( async (req, res, next) => {
  const startTime = Date.now();

    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    console.log('rawr', grpcRequestDurationHistogram.observe({ method:'unary' }, duration));
    const meow = await grpcRequestDurationHistogram.get()
    console.log('grpc-----', meow);
    const newMetric = await serverHandlingSecondsMetric.get();
    const severMsgSentMetric = await serverStreamMsgSentMetric.get();
    console.log("serverMsgSentMetric: ", severMsgSentMetric)
    console.log(newMetric)
    next()
    
  });
  


app.use( async (req, res,next) => {
  res.set('Content-Type', mergedRegistry.contentType);
  try{
    const metrics = await mergedRegistry.metrics()
    console.log(metrics)
    const metrics2 = await mergedRegistry2.metrics();
    console.log('Guage Metrics: ____________________',metrics2);
  const startTime = Date.now();

    const duration = (Date.now() - startTime) / 1000; // Convert to seconds

    console.log('rawr', grpcRequestDurationHistogram.observe({ method: req.method }, duration));
    const newMetric = await serverHandlingSecondsMetric.get();
    serverStreamMsgSentMetric.get().then(res => console.log(res))

    const k = serverStreamMsgSentMetric.labels('typeLabel','serviceLabel','methodLabel','pathLabel')
    console.log(k)
    console.log(newMetric)
   console.log(metrics)
    next()
  }
  catch(err){
    console.log('Error', err)
  }
});
app.get('/metrics', async(req,res)=> {
  res.set('Content-Type', register.contentType)
  res.send(await register.metrics())
})

app.listen(port, () => {
  console.log(`Prometheus metrics endpoint listening on port ${port}`);
});
// ... Code to start your RPC server


const GreetServiceImpl: GreetServiceImplementation = {
    async greetings(request: GreetRequest): Promise<DeepPartial<GreetResponse>> {
      try {
        const response: GreetResponse = {
          Goodbye: 'bye!',
        }
         const mergedRMetrics = await mergedRegistry.metrics()
        console.log("LOOK______________");
        console.log("Request: ", request);
        console.log(mergedRMetrics);
        console.log("Response: ", response)
        return response;
      } catch (err) {
        console.error(err);
        throw new ServerError(Status.ABORTED, 'An error occurred');
      }
    },
  };
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
  const server = createServer()
  server.use(prometheusServerMiddleware())
      server.add(GreetServiceDefinition, GreetServiceImpl)
      
  server.listen('0.0.0.0:3500', ServerCredentials.createInsecure())




import { CallContext, ServerError, Status, createServer,} from 'nice-grpc';
import {prometheusServerMiddleware} from 'nice-grpc-prometheus';
import { DeepPartial, GreetRequest, GreetResponse, GreetServiceDefinition, GreetServiceImplementation } from './compiled_proto/test'
import { ServerCredentials } from '@grpc/grpc-js';
import express,{Express,Request,Response} from 'express';
import { register,Counter,Gauge, Histogram, collectDefaultMetrics } from 'prom-client';
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
import {register as globalRegistry, Registry } from 'prom-client';
import {registry as niceGrpcRegistry} from 'nice-grpc-prometheus';
import path from 'path'
// !! collectDefaultMetrics() => Includes node metrics by default.
  // !! Need to check if it includes any gRPC metrics that we need. 
// Merge Registrys 
// const registry = new Registry()
// const mergedRegistry = Registry.merge([ niceGrpcRegistry,globalRegistry]);
import { mergedRegistry } from './registry';
// Metric Constructors 
const grpcRequestDurationHistogram = new Histogram({
  registers: [mergedRegistry],
  name: 'grpc_request_duration_seconds',
  help: 'Duration of gRPC requests',
  labelNames: ['method'],
  buckets: [0.1, 0.5, 1, 5, 10],
});
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

// const registry1 = new Registry();
// const registry2 = new Registry();
// const metric1 = new Gauge({ name: 'metric1', help: 'Metric 1' });
// const metric2 = new Gauge({ name: 'metric2', help: 'Metric 2' });
// registry1.registerMetric(metric1);
// registry2.registerMetric(metric2)
// metric1.set(42);
// metric2.set(3.14);
// const mergedRegistry2 = Registry.merge([registry1,registry2])




// Middleware to track request duration`
// =================== EXPRESS ROUTE FOR PROMETHEUS PULLING METRICS =============
const app = express();
const port = 9100;

app.use( async (req, res, next) => {
  const startTime = Date.now();
  const duration = (Date.now() - startTime) / 1000; 
  console.log('grpcRequestDurationHistogram Observe: ', grpcRequestDurationHistogram.observe({ method:req.method }, duration));

  const grpcReqDurationHist = await grpcRequestDurationHistogram.get()
  const grpcReqLabels = grpcRequestDurationHistogram.labels('method')
  // Start timer
  const start = grpcReqLabels.startTimer()
  console.log(start())
  console.log("GrpcReqLabels: ", grpcReqLabels)
  console.log('grpcRequestDurationHistogram.get() Method: ', grpcReqDurationHist);
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
    console.log("In Express, awaiting mergedRegistry.metrics() : __________",metrics)
    // const metrics2 = await mergedRegistry2.metrics();
    // console.log('Guage Metrics: ____________________',metrics2);
    const startTime = Date.now();
    const duration = (Date.now() - startTime) / 1000; // Convert to seconds

    console.log('grpcRequestDurationHistogram Observe Method: _____________', grpcRequestDurationHistogram.observe({ method: 'unary' }, duration));
    const newMetric =  serverHandlingSecondsMetric.observe(5);
    serverStreamMsgSentMetric.get().then(res => console.log(res))
    const servStartedMetric = await serverStartedMetric.get();
    serverStartedMetric.inc()
    serverStartedMetric.labels('typeLabel', 'serviceLabel', 'methodLabel', 'pathLabel')
    console.log('awaiting servStartedMetric.get() Method: ', servStartedMetric)

    const servStrmSentMet = serverStreamMsgSentMetric.labels('typeLabel','serviceLabel','methodLabel','pathLabel')
    console.log("serverStreeamMsgSentMetric.labels() Method: _________",servStrmSentMet)
    console.log(newMetric)
    console.log(metrics)
    next()
  }
  catch(err){
    console.log('Error', err)
  }
});
// EXPRESS FOR REACT 


//
app.get('/metrics', async(req,res)=> {
  res.set('Content-Type', register.contentType)
  console.log("Inside /metrics route :____________________________")
  res.end(await mergedRegistry.metrics())
})

app.listen(port, () => {
  console.log(`Prometheus metrics endpoint listening on port ${port}`);
});
/* =============================== */

const GreetServiceImpl: GreetServiceImplementation = {
    async greetings(request: GreetRequest): Promise<DeepPartial<GreetResponse>> {
      try {
        const response: GreetResponse = {
          Goodbye: 'bye!',
        }
        const mergedRMetrics = await mergedRegistry.metrics();
        console.log("Request From greetings :_______", request);
        console.log("Inside GreetServiceImpl: awaiting mergedRegistry.metrics()______",mergedRMetrics);
        console.log('gRPC Req Dur Histogram: _______', grpcRequestDurationHistogram.observe(1))
        serverHandlingSecondsMetric.observe(2)
       const histogramSeconds = await serverHandlingSecondsMetric.get()
       console.log('HISTOGRAM SECONDS _______', histogramSeconds)

        console.log("Response: ", response)
        return response;
      } catch (err) {
        console.error(err);
        throw new ServerError(Status.ABORTED, 'An error occurred');
      }
    },
  };


/* ========== Start gRPC Server ===========*/
const server = createServer()
server.use(prometheusServerMiddleware())
server.add(GreetServiceDefinition, GreetServiceImpl)
server.listen('0.0.0.0:3500', ServerCredentials.createInsecure())




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
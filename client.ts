import { ChannelCredentials, createClientFactory,createChannel } from "nice-grpc";
import { prometheusClientMiddleware, prometheusServerMiddleware } from "nice-grpc-prometheus";
import { GreetServiceClient,GreetServiceDefinition,GreetResponse,GreetRequest } from "./compiled_proto/test";
import { ChannelImplementation } from "@grpc/grpc-js/build/src/channel";
import {register as globalRegistry, Registry,Counter,Histogram, collectDefaultMetrics,Summary} from 'prom-client';
import {registry as niceGrpcRegistry} from 'nice-grpc-prometheus';
// // use `await mergedRegistry.metrics()` to export all metrics
import express from 'express';
// const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
import {mergedRegistry} from './registry';

const channel: ChannelImplementation = createChannel('localhost:3500', ChannelCredentials.createInsecure())
const registry = new Registry()
collectDefaultMetrics()
// Adding Counter to registry
const requestCounter = new Counter({
  name: "grpc_client_requests_total",
  help: "Total number of gRPC client requests",
  labelNames: ["service", "method"],
  registers: [registry],
})
const clientLatencyHistogram = new Histogram({
  name: "grpc_client_handling_seconds",
  help: "Histogram of response latency (seconds) of the gRPC until it is finished by the application.",
  labelNames: ["grpc_type", "grpc_service", "grpc_method", "grpc_path", "grpc_code"],
  registers: [registry],
});
const latencySummary = new Summary({
  name: 'grpc_client_latency_percentiles',
  help: 'Latency percentiles of the gRPC requests',
  labelNames: ['grpc_service', 'grpc_method'],
  percentiles: [0.5, 0.9, 0.99], // Update with desired percentiles
  registers: [registry],
});
async function runClient(): Promise <void> {
    try {
      const request:GreetRequest = {Hello: 'hi'}
      // const response:GreetResponse = await client.greetings({ Hello: 'hi' });
     
      const k = await mergedRegistry.metrics()
      // const u =  mergedRegistry.setDefaultLabels({
      //   service: 'test',
      //   method: 'greetings',  
      // })
      console.log(k)
      const z =  mergedRegistry.getSingleMetric("test")
      console.log(z)
      const kenny = await registry.getMetricsAsJSON();
      console.log(kenny)
      // console.log(u)
      const start = process.hrtime();
      const response: GreetResponse = await client.greetings(request);
      const end = process.hrtime(start);
      console.log("KKKKKKK---> ", k)
      requestCounter.inc({service: "test", method: "greetings"});
      // const response: GreetResponse = await client.greetings(request);
      console.log("RESPONSE_______________________________________")
      console.log('Response:', response);
      console.log(response.Goodbye);
      console.log("LATENCYYYYY_________________________________")
      const meow =  latencySummary.observe(0.025)
      console.log(meow)
      //
         // Record the response latency in the client-side histogram
    clientLatencyHistogram.observe(
      { grpc_type: "unary", grpc_service: "test.GreetService", grpc_method: "Greetings", grpc_path: "/test.GreetService/Greetings", grpc_code: "OK" },
      end[0] + end[1] / 1e9
    );
    console.log(clientLatencyHistogram.get())
    
  }  catch (error) {
      console.error('Error:', error);
    } finally {
      channel.close();
      try{
        const metrics = await mergedRegistry.metrics();
        console.log(metrics)
      }catch(error){

        console.log("ERROR RETREIVEING METRICS: ", error)
    }
  }
}
const client = createClientFactory()
    .use(prometheusClientMiddleware())
    .create(GreetServiceDefinition,channel)

    // Example function to record latency and trigger metrics
    function processGRPCRequest(service:any, method:any, latency:any) {
      // Record latency in the histogram metric
      clientLatencyHistogram.labels(service, method).observe(latency);
      
      // Record latency in the summary metric
      latencySummary.labels(service, method).observe(latency);
    }

runClient()
runClient()
runClient()
runClient()
runClient()
runClient()
runClient()

// processGRPCRequest('test.GreetService', 'Greetings',.5)
    const app = express();
const port = 9090;

app.get('/metrics', async (req, res) => {
  const hi = await mergedRegistry.metrics();
  console.log(hi)
  res.send(hi)
})
app.listen(port, () => console.log(`Listening on port ${port}`))



// import {
//   ChannelCredentials,
//   createClientFactory,
//   createChannel,
// } from "nice-grpc";
// import {
//   prometheusClientMiddleware,
//   prometheusServerMiddleware,
// } from "nice-grpc-prometheus";
// import {
//   GreetServiceClient,
//   GreetServiceDefinition,
//   GreetRequest,
//   GreetResponse,
// } from "./compiled_proto/test";
// import {
//   Counter,
//   Histogram,
//   Registry,
//   collectDefaultMetrics,
// } from "prom-client";

// // Create a Prometheus registry
// const registry = new Registry();

// // Create a counter metric for request count on the client side
// const clientRequestCounter = new Counter({
//   name: "grpc_client_requests_total",
//   help: "Total number of gRPC client requests",
//   labelNames: ["service", "method"],
//   registers: [registry],
// });

// // Create a counter metric for error count on the client side
// const clientErrorCounter = new Counter({
//   name: "grpc_client_errors_total",
//   help: "Total number of gRPC client errors",
//   labelNames: ["service", "method"],
//   registers: [registry],
// });

// // Create a histogram metric for response latency on the client side
// const clientLatencyHistogram = new Histogram({
//   name: "grpc_client_handling_seconds",
//   help: "Histogram of response latency (seconds) of the gRPC until it is finished by the application.",
//   labelNames: ["grpc_type", "grpc_service", "grpc_method", "grpc_path", "grpc_code"],
//   registers: [registry],
// });

// // Create a counter metric for request count on the server side
// const serverRequestCounter = new Counter({
//   name: "grpc_server_requests_total",
//   help: "Total number of gRPC server requests",
//   labelNames: ["service", "method"],
//   registers: [registry],
// });

// // Create a counter metric for error count on the server side
// const serverErrorCounter = new Counter({
//   name: "grpc_server_errors_total",
//   help: "Total number of gRPC server errors",
//   labelNames: ["service", "method"],
//   registers: [registry],
// });

// // Create a histogram metric for response latency on the server side
// const serverLatencyHistogram = new Histogram({
//   name: "grpc_server_handling_seconds",
//   help: "Histogram of response latency (seconds) of gRPC that had been application-level handled by the server.",
//   labelNames: ["grpc_type", "grpc_service", "grpc_method", "grpc_path", "grpc_code"],
//   registers: [registry],
// });

// // Register default metrics (e.g., process CPU, memory) with the registry
// collectDefaultMetrics({ register: registry });

// // Create a gRPC channel with the desired endpoint and credentials
// const channel = createChannel("localhost:3500", ChannelCredentials.createInsecure());

// async function runClient(): Promise<void> {
//   try {
//     // Create a gRPC client with the specified service definition and channel
//     const client = createClientFactory()
//       .use(prometheusClientMiddleware()) // Add Prometheus middleware to the client
//       .create(GreetServiceDefinition, channel);

//     // Make a gRPC call to the "greetings" method
//     const request: GreetRequest = { Hello: "hi" };
// const k = await mergedRegistry.metrics();
// console.log('k',k)
//     // Increment the request count metric on the client side
//     clientRequestCounter.inc({
//       service: "GreetService",
//       method: "Greetings",
//     });

//     const start = process.hrtime();
//     const response: GreetResponse = await client.greetings(request);
//     const end = process.hrtime(start);
    
//     console.log("Response:", response);
//     console.log(response.Goodbye);

//     // Record the response latency in the client-side histogram
//     clientLatencyHistogram.observe(
//       { grpc_type: "unary", grpc_service: "test.GreetService", grpc_method: "Greetings", grpc_path: "/test.GreetService/Greetings", grpc_code: "OK" },
//       end[0] + end[1] / 1e9
//     );
//     console.log(clientLatencyHistogram.get)
//     console.log(clientLatencyHistogram.startTimer())
//   } catch (error) {
//     console.error("Error:", error);

//     // Increment the error count metric on the client side
//     clientErrorCounter.inc({
//       service: "GreetService",
//       method: "Greetings",
//     });
//   } finally {
//     // Close the gRPC channel
//     channel.close();

//     // Log the metrics to the console
    
//   }
// }

// runClient();
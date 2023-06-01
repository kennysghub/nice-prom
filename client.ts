import { ChannelCredentials, createClientFactory,createChannel } from "nice-grpc";
import { GreetServiceDefinition,GreetResponse,GreetRequest } from "./compiled_proto/test";
import { ChannelImplementation } from "@grpc/grpc-js/build/src/channel";
import {register as globalRegistry, Registry,Counter,Histogram, collectDefaultMetrics,Summary} from 'prom-client';
import {registry as niceGrpcRegistry} from 'nice-grpc-prometheus';
import { prometheusClientMiddleware } from "nice-grpc-prometheus";
// const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
import {mergedRegistry} from './registry';

const channel: ChannelImplementation = createChannel('https://localhost:3500', ChannelCredentials.createInsecure())
const registry = new Registry()
collectDefaultMetrics()
// !!!!! These are different constructors from <prom-client> !!!!!!!!!!!!!!
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
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
async function runClient(): Promise <void> {
    try {
      const request:GreetRequest = {Hello: 'hi'} 
      //* Need the response and invoking the client line 
      const response: GreetResponse = await client.greetings(request);
      requestCounter.inc({service: "test", method: "greetings"});
      const clientLatencyHist = await clientLatencyHistogram.get();
      console.log("Client Latency Histogram:______________", clientLatencyHist)
      console.log('This is the response from inside client.ts runClient() Method:_____', response)
  } catch (error) {
      console.error('Error:', error);
    } finally {
        channel.close();
      try{
        const metrics = await mergedRegistry.metrics();
        console.log("Await mergedRegistry.metrics()_____________", metrics)
      }catch(error){
        console.log("ERROR RETREIVEING METRICS: ", error)
    }
  }
}
const client = createClientFactory()
  .use(prometheusClientMiddleware())
  .create(GreetServiceDefinition,channel)

runClient()



import { ChannelCredentials, createClientFactory,createChannel } from "nice-grpc";
import { prometheusClientMiddleware } from "nice-grpc-prometheus";
import { GreetServiceDefinition,GreetResponse, GreetRequest } from "./compiled_proto/test";
import { ChannelImplementation } from "@grpc/grpc-js/build/src/channel";
import globalRegistry from './registry'
import { mergedRegistry } from "./registry";
import niceGrpcRegistry from "./registry";



const channel: ChannelImplementation = createChannel('localhost:3500', ChannelCredentials.createInsecure())

const client = createClientFactory()
    .use(prometheusClientMiddleware())
    .create(GreetServiceDefinition,channel)

const request: GreetRequest = {Hello: 'hi'}

const clientRequest = async () => {
  const response = await client.greetings(request)
  console.log(`response:`, response)
}

clientRequest();

mergedRegistry.metrics().then(data => console.log(`merged: `, data))
globalRegistry.metrics().then(data => console.log(`global: `, data));
niceGrpcRegistry.metrics().then(data => console.log(data))
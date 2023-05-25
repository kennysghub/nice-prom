import { ChannelCredentials, createClientFactory,createChannel } from "nice-grpc";
import { prometheusClientMiddleware, prometheusServerMiddleware } from "nice-grpc-prometheus";
import { GreetServiceClient,GreetServiceDefinition,GreetResponse } from "./compiled_proto/test";
import { ChannelImplementation } from "@grpc/grpc-js/build/src/channel";
import { mergedRegistry } from "./registry";
import express from 'express';


// const app = express();
// const port = 9090;


// app.listen(port, () => console.log(`listening on port:${port}`))

const channel: ChannelImplementation = createChannel('localhost:3500', ChannelCredentials.createInsecure())

const client = createClientFactory()
    .use(prometheusClientMiddleware())
    .create(GreetServiceDefinition,channel)

async function runClient(): Promise <void> {
    try {
      const response:GreetResponse = await client.greetings({ Hello: 'hi' });
      console.log('Response:', response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      channel.close();
    }
}
      
runClient();


// app.get('/metrics', (req, res) => {
//   res.set('Content-Type', mergedRegistry.contentType);
//   res.send(mergedRegistry.metrics().then(data => data))
// })

// channel.close()
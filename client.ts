import { ChannelCredentials, createClientFactory,createChannel } from "nice-grpc";
import { prometheusClientMiddleware, prometheusServerMiddleware } from "nice-grpc-prometheus";
import { GreetServiceClient,GreetServiceDefinition,GreetResponse } from "./compiled_proto/test";
import { ChannelImplementation } from "@grpc/grpc-js/build/src/channel";
import globalRegistry from './registry'
import { Histogram,Counter, collectDefaultMetrics, register } from 'prom-client';


const channel: ChannelImplementation = createChannel('localhost:3500', ChannelCredentials.createInsecure())
import { ContactServiceClient, ContactRequestProto, Empty, ContactResponse, ContactList, ContactServiceDefinition } from './compiled_proto/contacts';


const clientFactory = createClientFactory()
.use(prometheusClientMiddleware())
.create(GreetServiceDefinition,channel)
interface MyGreetService extends GreetServiceDefinition {}
// Get a single contact by first name and last name
const another = createClientFactory()
.create(ContactServiceDefinition,channel)


async function getContact(firstName: string, lastName: string): Promise<ContactResponse> {
    const request = new ContactRequestProto();
    request.setFirstName(firstName);
    request.setLastName(lastName);
  
    return new Promise<ContactResponse>((resolve, reject) => {
    
    });
  }


async function runClient(): Promise <void> {
    try {
            // Record the start time of the RPC call
    const startTime = Date.now();

    // Your gRPC client call code here

    // Record the end time of the RPC call
    const endTime = Date.now();

    // Calculate the duration of the RPC call
    const duration = endTime - startTime;
          const response:GreetResponse = await clientFactory.greetings({ Hello: 'hi' });
          const histogram = new Histogram({
            name: 'grpc_client_request_duration',
            help: 'Duration of gRPC client requests',
            labelNames: ['service', 'method'],
            registers: [register],
          });
          
          console.log('Response:', response);
          histogram
          .labels('GreetService', 'greetings')
          .observe(duration);
          console.log("HISTOGRAMMM----", histogram)
          console.log(globalRegistry.metrics().then(res => console.log("RES--->", res)))
          console.log("DEFAULT METRICS: ", collectDefaultMetrics())
          console.log("REGISTER: ", register.getMetricsAsArray())
          console.log("Zeorth Element: ", register.getMetricsAsArray()[0].collect)
          getContact("kenny","nguyen"); Promise <ContactResponse>
        } catch (error) {
          console.error('Error:', error);
        } finally {
          channel.close();
        }
      }
      
      
      runClient();

// channel.close()


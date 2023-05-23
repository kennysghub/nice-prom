import { createServer} from 'nice-grpc';
import {prometheusServerMiddleware} from 'nice-grpc-prometheus';
//import * as serverRegistry from './registry';
import { DeepPartial, GreetRequest, GreetResponse, GreetServiceDefinition, GreetServiceImplementation } from './compiled_proto/test'

console.log(`createServer: ${createServer}`);


const GreetServiceImpl: GreetServiceImplementation = {
    async greetings(request: GreetRequest, callback: any) : Promise<DeepPartial<GreetResponse>> {
        try {
            const response: GreetResponse = {
                Goodbye: 'bye!'
            };
            callback(null, response)
            return response;
        } catch(err) {
            console.log(`error: ${err}`)
        }
    }
}

const server = createServer();
    server.add(GreetServiceDefinition, GreetServiceImpl);

server.listen('127.0.0.1:3500', (): any => console.log(`listning on port 3500`))
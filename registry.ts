//require prom-client: prometheus for node.js that supports historgram, summaries, gauges and counters
//works with nice-grpc-prometheus
// import promClient from 'prom-client';
//globalRegistry is assinged to an instance of Registery
// const globalRegistry= promClient.register;
//Registry is the class in prom-client (lambda Registry)
const {Registry} = promClient;
// export default globalRegistry;




//console.log(`globalRegistry: ${globalRegistry}, Registry: ${Registry}`)

//require nice-grpc-prometheus
// import niceGrpcClient from 'nice-grpc-prometheus';
// const niceGrpcRegistry = niceGrpcClient.registry;

//merge niceGrpcRegistry with global (use await to export all metrics)
// export const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);

//export



import * as promClient from 'prom-client';
import { registry as niceGrpcRegistry } from 'nice-grpc-prometheus';

const globalRegistry = promClient.register;
const mergedRegistry = promClient.Registry.merge([globalRegistry, niceGrpcRegistry]);

export default mergedRegistry;

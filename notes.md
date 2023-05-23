// server.ts
```javascript
import * as grpc from '@grpc/grpc-js';
import { loadPackageDefinition } from '@grpc/proto-loader';
import * as protoLoader from '@grpc/proto-loader';
import { promisify } from 'util';
import * as promClient from 'prom-client';

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const packageDefinition = protoLoader.loadSync(
    __dirname + '/yourProtoFile.proto',
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const yourProto = loadPackageDefinition(packageDefinition).yourNamespace;

const server = new grpc.Server();

server.addService(yourProto.YourService.service, {
    yourRpcMethod: (call, callback) => {
        // Handle your RPC method here.
        callback(null, { yourResponseField: 'Response' });
    },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(`Server error: ${error}`);
    } else {
        console.log(`Server running at http://0.0.0.0:${port}`);
        server.start();
    }
});
```


```javascript
try {
    const request = {};
    const startTime = Date.now(); // Record the start time of the RPC call
    const response = await client.exampleUnaryMethod(request);
    const endTime = Date.now(); // Record the end time of the RPC call

    // Calculate the duration of the RPC call
    const duration = endTime - startTime;

    // Register custom metrics with Prometheus
    registry.histogram({
      name: 'grpc_client_request_duration',
      help: 'Duration of gRPC client requests',
      labelNames: ['service', 'method'],
    }).observe({ service: 'ExampleService', method: 'exampleUnaryMethod' }, duration);

    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }

  channel.close();
}

runClient();

```
# nice-prom

## Installation 
```
npm install 
```

Make sure typescript files are compiled.  Run `tsc`. This will compile the typescript files into the `dist` folder. Then run: 
```
node dist/server.js
```
In a separate terminal run:
```
node dist/client.js
```
Express route at `localhost:8080/metrics` has Prometheus Client pulling metrics of gRPC streams. 
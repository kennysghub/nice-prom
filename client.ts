import { createClientFactory } from "nice-grpc";
import { prometheusClientMiddleware, prometheusServerMiddleware } from "nice-grpc-prometheus";

const clientFactory = createClientFactory()
    .use(prometheusServerMiddleware())
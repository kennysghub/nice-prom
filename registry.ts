import {register as globalRegistry, Registry } from 'prom-client';
import {registry as niceGrpcRegistry} from 'nice-grpc-prometheus';

//const niceGrpcRegistry = niceGrpcClient.registry;
// const globalRegistry = register;

export const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
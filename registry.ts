import {register as globalRegistry, Registry} from 'prom-client';
import {registry as niceGrpcRegistry} from 'nice-grpc-prometheus';

export const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
export default niceGrpcRegistry;
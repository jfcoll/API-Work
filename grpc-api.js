const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('course.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(proto.CourseService.service, {
  GetCourse: (call, callback) => {
    callback(null, { name: `gRPC Course ID: ${call.request.id}` });
  }
});

server.bindAsync('0.0.0.0:3004', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC API running on port 3004');
  server.start();
});

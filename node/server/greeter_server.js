var PROTO_PATH = __dirname + '/protos/guessNumber.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,{});
var number_proto = grpc.loadPackageDefinition(packageDefinition).guessNumber;
//Num random entre 1 y 100
var numRandom = Math.round(Math.random()*(100-1)+1);
console.log('Numero aleatorio: ' + numRandom);
/**
 * Implements the validateNumber RPC method.
 */
function validateNumber(call, callback) {
  var numClient = call.request.num;
  var response = '';
  var status = '';
  if(numClient){
      if(numRandom > numClient){
        response = 'El número debe ser mayor a ' + numClient;
        status = 'info';
      }else if(numRandom < numClient){
        response = 'El número debe ser menor a ' + numClient;
        status = 'danger';
      }else{
        response = '¡FELICIDADES, HA GANADO! EL NÚMERO GANADOR FUE ' + numRandom;
        status = 'success';
      }
}else{
  response = 'Debe ingresar un número';
}

  callback(null, {message: response, status: status});
  console.log('He recibido el numero: ' + call.request.num);
  console.log('Cliente: ' + call.request.port);
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(number_proto.Greeter.service, {validateNumber: validateNumber});
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();

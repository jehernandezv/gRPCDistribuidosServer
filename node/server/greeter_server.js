// Ruta de archivo proto
var PROTO_PATH = __dirname + '/protos/guessNumber.proto';

// Importación de paquetes grpc
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
const port = process.argv[2];

//Descriptores de servicios
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,{});
var number_proto = grpc.loadPackageDefinition(packageDefinition).guessNumber;

//Num random entre 1 y 100
var numRandom = Math.round(Math.random()*(100-1)+1);
console.log('Numero aleatorio: ' + numRandom);

/**
 * Implementa un método RPC encargado de validar un número
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

  //Devolución de llamada con primer parámetro nulo para indicar que no hay error
  callback(null, {message: response, status: status});
  console.log('He recibido el numero: ' + call.request.num);
  console.log('Cliente: ' + call.request.port);
}

/**
 * Inicia un servidor RPC que recibe las solicitudes para el servicio de validación de números
 */
function main() {
  // Se crea el servidor de acuerdo al descriptor de servicio
  var server = new grpc.Server();
  // Agrega el servicio de validación del número
  server.addService(number_proto.Greeter.service, {validateNumber: validateNumber});
  // Se especifica la dirección y el puerto para escuchar las solicitudes de los clientes
  server.bind('0.0.0.0:'+port, grpc.ServerCredentials.createInsecure());
  // Inicia el servidor RPC
  server.start();
}

// Llamado de inicialización del servicio
main();

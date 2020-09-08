const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = process.argv[2];
const host = process.argv[3];
var response_server = '';
var response_status = '';

// Ruta de archivo proto
var PROTO_PATH = __dirname + '/protos/guessNumber.proto';

// Importación de paquetes grpc
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

//Descriptores de servicios
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,{});
var number_proto = grpc.loadPackageDefinition(packageDefinition).guessNumber;

// Settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Page route
app.get('/', (req, res)=>{
  res.render('index',{response_server, response_status});
});

// Service sendNumber
app.post('/sendNumber', (req, res)=>{
  sendNumber(req.body.number, res);
  console.log("Number: " + req.body.number);
});

/**
 * Envía al servidor el número ingresado por el cliente, a través de RPC
 * @param {*} number 
 * @param {*} res 
 */
function sendNumber(number, res) {
  //Creación del stub
  var client = new number_proto.Greeter(host, grpc.credentials.createInsecure());
  var num = number;
  var portClient = port;
  // Envío de parámetros al servidor
  client.ValidateNumber({num: num, port: portClient}, function(err, response) {
    response_server = response.message;
    console.log(response.message);
    response_status = response.status;
    res.redirect('/');
  });
}

app.listen(port, () => console.log(`Cliente escuchando en puerto ${port}`));
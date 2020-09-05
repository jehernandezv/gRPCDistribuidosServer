const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = process.argv[2];
var response_server = '';

var PROTO_PATH = __dirname + '/protos/guessNumber.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,{});
var number_proto = grpc.loadPackageDefinition(packageDefinition).guessNumber;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res)=>{
  res.render('index',{response_server});
});


app.post('/sendNumber', (req, res)=>{
  sendNumber(req.body.number, res);
  console.log("Number: " + req.body.number);
});

function sendNumber(number, res) {
  var client = new number_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  var num = number;
  var portClient = port;
  client.ValidateNumber({num: num, port: portClient}, function(err, response) {
    console.log('recibe del server:', response.message);
    response_server = response.message;
    res.redirect('/');
  });
}

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
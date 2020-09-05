const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = process.argv[3];

var PROTO_PATH = __dirname + '/protos/helloworld.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res)=>{
  res.render('index');
});


app.post('/sendNumber', (req, res)=>{
  sendNumber(req.body.number);
  console.log("Number: " + req.body.number);
  res.redirect('/');
});

function sendNumber(number) {
  var client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  var user;
  var portClient;
  if (process.argv.length >= 3) {
    user = number;
    portClient = port;
  } else {
    user = 'world';
  }
  client.sayHello({name: user, port: portClient}, function(err, response) {
    console.log('Greeting:', response.message);
  });
}

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
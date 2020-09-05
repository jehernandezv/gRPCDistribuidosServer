var socket = io('192.168.1.33:3000');
//var socket = io('localhost:3000');

import UI from './UI';
const ui = new UI();
var hora = 0;
var minuto = 0;
var segundo = 0;

document.getElementById('btn-changeDate').addEventListener('click', async (event) => {
    event.preventDefault();
    const anterior = hora + ' : ' + minuto + ' : ' + segundo;
    hora = parseInt(await document.getElementById('hour').value);
    minuto = parseInt(await document.getElementById('minute').value);
    segundo = parseInt(await document.getElementById('second').value);
    ui.renderTable({
        anterior: anterior,
        actual: hora + ' : ' + minuto + ' : ' + segundo,
        ajuste: '   :   ' + '   :   ',
        update: 'Usuario'
    });
});

function actual() {

    segundo = segundo + 1;
    if (segundo == 60) {
        minuto = minuto + 1;
        segundo = 0;
        if (minuto == 60) {
            hora = hora + 1;
            minuto = 0;
            if (hora == 24) {
                hora = 0;
            }
        }
    }
    //devolver los datos:
    const mireloj = ((hora < 10) ? '0' + hora : hora) + ' : ' + ((minuto < 10) ? '0' + minuto : minuto) + ' : ' + ((segundo < 10) ? '0' + segundo : segundo);
    return mireloj;
}

function actualizar() { //función del temporizador
    const mihora = actual(); //recoger hora
    const mireloj = document.getElementById("reloj"); //buscar elemento reloj
    mireloj.innerHTML = mihora; //incluir hora en elemento
}
setInterval(actualizar, 1000); //iniciar temporizador

function convertTimeToSeconds() {
    let seconds = 0;
    seconds += hora * 3600;
    seconds += minuto * 60;
    seconds += segundo;
    return seconds;
}

function convertSecondsToTime(seconds) {
    hora = Math.trunc(seconds / 3600);
    console.log("horas " + hora);
    seconds -= hora * 3600;

    minuto = Math.trunc(seconds / 60);
    console.log("minutos " + minuto);
    seconds -= minuto * 60;

    segundo = Math.trunc(seconds);
    console.log("segundos " + segundo);
}

function convertSecondsToTimeString(seconds){
    let hora = Math.trunc(seconds / 3600);
    seconds -= hora * 3600;
    let minuto = Math.trunc(seconds / 60);
    seconds -= minuto * 60;
    let segundo = Math.trunc(seconds);
    return hora + ' : ' + minuto + ' : ' + segundo;
}

socket.on('req:time', function () {
     socket.emit('hour:client', {
        timeClient: convertTimeToSeconds(),
        id_socket: socket.id
    });
});

socket.on('res:time', (data) => {
    const offset = data.offset;
    console.log(offset);
    const beforeHHMMSS = hora + ' : ' + minuto + ' : ' + segundo;
    const timeSS = convertTimeToSeconds();
    console.log("time ss: " + timeSS);
    convertSecondsToTime(offset);
    let beforeSS = (offset > timeSS) ? offset - timeSS:((timeSS - offset) * -1); 
    ui.renderTable({
        anterior: beforeHHMMSS,
        actual: hora + ' : ' + minuto + ' : ' + segundo,
        ajuste: convertSecondsToTimeString(beforeSS) ,
        update: 'Server'
    });
});
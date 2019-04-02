var express = require('express');
const JSON = require('circular-json');
var app = express();
const PORT = 3555;

const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(3555);
app.use(express.json());    // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true}));

var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'}),
    consumer = new Consumer(
        client,
        [
            {topic: 'patient_alert', partition: 0}
        ],
        {
            autoCommit: false,
            groupId: 'group_id'
        });

io.on('connection', socket => {
    console.log(`Socket ${socket.id} added`);
    consumer.on('message', function (message) {
        console.log(`Emitted kafka: ${message}`+ JSON.stringify(message));
        socket.emit('data', { data: message});
    });

    socket.on('clientdata', data => {
        console.log(data);
    });
});

consumer.on('error', function (err) {
    console.log("error while connecting Kafka" + err);
});

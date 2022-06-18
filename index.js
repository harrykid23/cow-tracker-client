var express = require("express");
var bodyParser = require("body-parser");
const app = express();
var Mqtt = require("azure-iot-device-mqtt").Mqtt;
var DeviceClient = require("azure-iot-device").Client;
var Message = require("azure-iot-device").Message;
const connectionString = process.env.CONNECTION_STRING;
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/report-data", function (req, res) {
  const message = new Message(JSON.stringify(req.body));
  client.sendEvent(message, function (err) {
    if (err) {
      res.send({ success: 0, message: err.toString() });
    } else {
      res.send({ success: 1 });
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App started successfully in http://localhost:3000/`);
});

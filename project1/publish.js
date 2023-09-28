/* eslint-disable no-undef */
var awsIot = require("aws-iot-device-sdk")

var device = awsIot.device({
    keyPath: "certificate/ff811397de0bcd9cc40d237981b1804bf17bf545cb5e1416c64a8df7b6e1b7e8-private.pem.key",
    certPath: "certificate/ff811397de0bcd9cc40d237981b1804bf17bf545cb5e1416c64a8df7b6e1b7e8-certificate.pem.crt",
    caPath: "certificate/AmazonRootCA1.pem",
    clientId: "LoRaWAN",
    host: "a2qpin6j86jdos-ats.iot.us-east-1.amazonaws.com",
});

console.log("device", device);
const today = new Date();
const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
const dateTime = date + " " + time;

let latitude = Math.random() * 100 + 1;
let longitude = Math.random() * 100 + 1;

let payload = [];
payload.push({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
});

const sensorData = {
    timestamp: dateTime,
    payload: payload
};
console.log("Latitude",latitude);
console.log("longitude",longitude);

device.on("connect", () => {
    console.log("Connected to AWS IoT Core");
    const topicToSubscribe = "map/location";

    device.subscribe(topicToSubscribe, {}, (err) => {
        if (err) {
            console.error("Error subscribing to topic:", err);
        } else {
            device.publish(topicToSubscribe, JSON.stringify(sensorData));
            console.log("Subscribed to topic:", topicToSubscribe);
        }
    });
});

device.on("message", (topic, payload) => {
    console.log("Received message from topic:", topic);
    console.log("Message payload:", payload.toString());
});

device.on("error", (error) => {
    console.error("Error:", error);
});
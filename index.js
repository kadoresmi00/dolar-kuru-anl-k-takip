const express = require("express")
const fetch = require("node-fetch")

const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
var Data

let fetchCurrency = async() => {
    try {
        fetch('https://cancaliskan-doviz-api.herokuapp.com/', { method: "Get" }).then(res => res.json())
            .then((json) => {
                Data = json.Dollar
            });
    } catch (e) {
        console.log(e)
    }
}

let currencyPoller = async() => {
    await fetchCurrency()
    setTimeout(async() => {
        await fetchCurrency()
        currencyPoller()
    }, 1000);
}

currencyPoller()

io.on("connection", (socket) => {
    let socketPoller = () => {
        socket.emit('currency-data', Data)
        setTimeout(() => {
            socket.emit('currency-data', Data)
            socketPoller()
        }, 1000);
    }

    socketPoller()

    socket.on("disconnect", () => {})
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/kado.html');
});

http.listen(3000, () => {
    console.log(`Kado`)
})

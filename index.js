const port = process.env.PORT || 5000;
const express = require("express");
const mysql = require('mysql');
const bodyParser = require("body-parser");

// App
const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// ket noi database mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20184186',
    database: 'room_management'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    // getRooms();
    // getUsers();
    getRooms();
    getRoomById();
});

app.get("/", (req, res) => {
    res.send("asdasdasdasdasd");
});



// listen for request
const listener = app.listen(port, () => {
    console.log("App is listening at port", port);
});


const getRooms = () => {
    app.get("/rooms", (req, res) => {

        const query = req.query;
        const { name } = query;
        db.query(`SELECT * FROM room where room.name LIKE '%${name}%';`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });

}

const getRoomById = () => {

    app.get("/rooms/:id", (req, res) => {
        const { id } = req.query;
        db.query(`SELECT * FROM room where room.id = ${id}`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}

const getUsers = () => {
    db.query("SELECT * FROM user", function (err, result, fields) {
        if (err) throw err;
        app.get("/users", (req, res) => {
            res.json(result);
        });
    });
}



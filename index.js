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
// allow acess method
var cors = require("cors");
// use it before all route definitions
app.use(cors({ origin: 'http://localhost:3000' }));




db.connect((err) => {
    if (err) {
        throw err;
    }
    // ROOM
    getRooms();
    getRoomById();
    getHometype();

    postRoom();

    // USER
    getUsers();
    getUserById();

    postLogin();

    // HOST
    getHosts();
    getHostById();

    getHighRatingHost();

    // IMAGE
    getImageUrlByRoomId();

    // PURCHASE
    getPurchases();
    getPurchaseById();

    // REVIEW
    getReviews();
});

app.get("/", (req, res) => {
    res.send("asdasdasdasdasd");
});



// listen for request
const listener = app.listen(port, () => {
    console.log("App is listening at port", port);
});



//** function tạo api */

// ROOM
const getRooms = () => {
    app.get("/rooms", (req, res) => {
        db.query(`SELECT room.id, room.price, room.home_type, room.total_bedrooms, room.total_bathrooms, room.city, room.has_tv, room.has_air_con, room.has_heating, room.has_internet, room.state, url, room_id FROM room,  images where room.id = images.room_id group by room.id;`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}

const getRoomById = () => {
    app.get("/rooms/:id", (req, res) => {
        const { id } = req.params;
        db.query(`SELECT * FROM room where room.id = ${id}`, function (err, roomInfo, fields) {
            if (err) throw err;
            res.json(roomInfo);
        });
    });
}

const getImageUrlByRoomId = () => {
    app.get("/images/by-roomId/:id", (req, res) => {
        const { id } = req.params;
        db.query(`select url as url_image from room, images where room.id = images.room_id and room.id = ${id};`, function (err, imageUrls, fields) {
            if (err) throw err;
            res.json(imageUrls);
        });
    });

}

const getHometype = () => {
    app.get("/room-hometypes", (req, res) => {
        db.query(`select room.home_type, count(*) as counted from room group by home_type order by counted desc;`, function (err, hometypes, fields) {
            if (err) throw err;
            res.json(hometypes);
        });
    });
}


const postRoom = () => {
    app.post('/rooms', (req, res) => {
        const newRoom = req.body;
        newRoom.host_id = parseInt(newRoom.host_id);
        const { id, name, host_id, price, home_type, total_bedrooms, total_bathrooms, city, latitude, longitude, has_tv, has_air_con, has_heating, has_internet, state } = newRoom
        var sql = `INSERT INTO room(id, name, price, home_type, total_bedrooms, total_bathrooms, city, latitude, longitude, has_tv, has_air_con, has_heating, has_internet, state) VALUES(${id},"${name}",${price},"${home_type}",${total_bedrooms},${total_bathrooms},"${city}",${latitude},${longitude},${has_tv},${has_air_con},${has_heating},${has_internet},${state});`;
        var sql_2 = `INSERT INTO room_host(room_id, host_id) VALUES (${id}, ${host_id});`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        db.query(sql_2, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
}



// USER
const getUsers = () => {
    app.get("/users", (req, res) => {
        db.query(`SELECT * FROM user;`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}

const getUserById = () => {
    app.get("/users/:id", (req, res) => {
        const { id } = req.params;
        db.query(`SELECT * FROM user where user.id = ${id}`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}


const postLogin = () => {
    app.post("/login-user", (req, res) => {
        const loginInput = req.body;
        const { email, password } = loginInput
        db.query(`SELECT * FROM user where user.email = "${email}"`, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            console.log('oke');
            console.log(result.length);
            if (result.length > 0) {
                res.json({
                    message: 'success',
                    role: result[0].role,
                    id: result[0].id
                })
            } else {
                res.json({
                    message: 'fail',
                    role: 'none',
                    id: undefined
                })
            }

        });
    });
}


// HOST
const getHosts = () => {
    app.get("/hosts", (req, res) => {
        db.query(`SELECT * FROM host;`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}


const getHostById = () => {
    app.get("/hosts/:id", (req, res) => {
        const { id } = req.params;
        db.query(`SELECT * FROM host where host.id = ${id}`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}

const getHighRatingHost = () => {
    app.get("/top-rating-host", (req, res) => {
        db.query(`select * from host where host.rating = (select max(rating) from host);`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}




// PURCHASE
const getPurchases = () => {
    app.get("/purchases", (req, res) => {
        db.query(`SELECT * FROM reservations;`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}


const getPurchaseById = () => {
    app.get("/purchases/:id", (req, res) => {
        const { id } = req.params;
        db.query(`SELECT * FROM reservations where reservations.id = ${id}`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}



// REVIEW

const getReviews = () => {
    app.get("/reviews", (req, res) => {
        db.query(`SELECT * FROM review;`, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
}




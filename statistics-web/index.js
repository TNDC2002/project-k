// thu vien
var express = require("express")
var cookieParser = require('cookie-parser')
// var file = require('fs')
var path = require('path')

// setting apps
var app = express()

app.set("views", "./views")
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'views')))
app.use(cookieParser('iojkmygvbthuerfcasddfsgxvcert'))

//port and notification
const PORT = 8000
app.listen(PORT, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
console.log()
console.log(' ____________________________________________________________________________________________________\n \
|                                                                                                  |\n \
|                                                                                                  |\n \
|                                        run on port: 3000                                         |\n \
|                                                                                                  |\n \
|                                                                                                  |\n \
====================================================================================================')

// khai báo các route
var index = require("./routes/index")

// cài đặt URL	 	
app.use("/reciever/reactor", index)



module.exports = app
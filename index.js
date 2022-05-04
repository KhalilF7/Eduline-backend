if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const local_auth = require('passport-local');
const session = require('express-session');
const User = require('./models/user');
const MongoDBStore = require('connect-mongodb-session')(session)
const userRoutes = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');

const roomRoutes = require('./routes/room');
const forumRoutes = require('./routes/forums.js');
const answerRoutes = require('./routes/answers.js');
const commentRoutes = require('./routes/comments.js');
const calenderASRoutes = require('./routes/calender');
const courseASRoutes = require('./routes/courseAS');
const contactRoutes = require('./routes/Contact');
const domainASRoutes = require('./routes/domainAS');
const chapterASRoutes =require('./routes/chapterAS');
var apiRoutes = require('./routes/api')
var teacherRoutes = require('./routes/teacher')
var studentRoutes = require('./routes/student')
var adminRoutes = require('./routes/admin')
var uploadImgRoutes = require('./routes/uploadImg')

const app = express();

const dbUrl = process.env.DB_CONNECT || 'mongodb+srv://EDULINE:EDULINESDIRI@cluster0.lcx2y.mongodb.net/test';
mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
})

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';




const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration



var server = require('http').Server(app);
app.set("view engine", "ejs");
/*app.use(mongoSanitize());*/
app.use(express.json());
//////////////////////////////////////////////
passport.use(new local_auth(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', userRoutes);
app.use('/', roomRoutes);

app.use('/courseAS',courseASRoutes);
app.use('/courseAS/domain',domainASRoutes);
app.use('/courseAS/chapter',chapterASRoutes);
app.use('/calendar',calenderASRoutes);
app.use('/forums', forumRoutes);
app.use('/answers', answerRoutes);
app.use('/forums', commentRoutes);
app.use('/contact',contactRoutes );
app.use('/uploads/', express.static('uploads'))
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/upload', uploadImgRoutes);

const bodyParser = require('body-parser');

app.use(bodyParser.json());

require('./routes/dialogFlowRoutes')(app);
require('./routes/fulfillmentRoutes')(app);


require('./models/Registration');
require('./models/Demand');
require('./models/Coupons');

if (process.env.NODE_ENV === 'production') {
    // js and css files
    app.use(express.static('client/build'));

    // index.html for all page routes
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


var io = require('socket.io')(server,
    {
        cors:
        {
            origin: '*',
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });
app.set('io', io);
io.on('connection', socket => {

    console.log("new  sockeet connection...");
    socket.emit("test event", "hey utsav");

});


const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
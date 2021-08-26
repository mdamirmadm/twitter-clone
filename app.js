if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const User = require('./models/users');
const {isLoggedIn} = require('./middleware');
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const Chat = require('./models/chats');

mongoose.connect(process.env.DB_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log('DB connected!'))
    .catch(err => console.log(err))

//setting up the view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

//serving static file (css and js files)
app.use(express.static(path.join(__dirname,'/public')));

//middleware for parsing the request body
app.use(express.urlencoded({extended:true}));
app.use(express.json());


//Getting routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoute');


//Getting postAPIRoutes
const postAPIRoutes = require('./routes/api/post');


//setting up sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

//setting up flash for displaying messages
app.use(flash());

//setting up passport for authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.get('/', isLoggedIn,(req,res) => {
    res.render("home");
})

//Routes
app.use(authRoutes);
app.use(profileRoutes);
app.use(chatRoutes);


//APIs
app.use(postAPIRoutes);

io.on('connection',(socket) => {
    
    socket.on('send-msg',async(data) => {
        
        console.log(data);
        io.emit('received-msg',{msg:data.msg,username:data.username,createdAt: new Date()});

        await Chat.create({content: data.msg, username: data.username})
    })
})

//Listening to the server
server.listen(process.env.PORT || 3000,() => {
    console.log("Server running at port 3000");
})
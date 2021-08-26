const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Profile = require('./models/profile');

mongoose.connect('mongodb://localhost:27017/profiler-1', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Data Base Connected to App JS Prfiler-1 !!!');
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/login', (req, res) => {
    res.render('./pages/login');
});

app.post('/login', async (req, res) => {
        try {
            const profile = await Profile.findOne({userName: req.body.userName});
            let enteredPassword = req.body.password;
            if(enteredPassword == profile.password) {
                profile.loggedIn = true;
                await profile.save();
                res.redirect(`/${profile._id}/profile`);
            }
            else {
                res.render('./pages/error', {err: 'Wrong Password'});
            }
        }catch(err) {
            res.render('./pages/error', {err});
        }
})

app.get('/registration', (req, res) => {
    res.render('./pages/registration');
});

app.post('/registration', async (req, res) => {
    const newProfile = req.body.profile;
    const p1 = await Profile.findOne({userName: newProfile.userName});
    const p2 = await Profile.findOne({email: newProfile.email});
    if(!p1 && !p2) {
        newProfile.loggedIn = true;
        const profile = new Profile(newProfile);
        await profile.save();
        const p = await Profile.findOne(profile);
        res.redirect(`/${p._id}/profile`);
    } else {
        res.render('./pages/error', {err: 'email or userName already registered'});
    }
});

app.get('/aboutUs', (req, res) => {
    res.render('./pages/aboutUs');
});

app.get('/', (req, res) => {
    res.render('./pages/homepage');
});

app.get('/:id/logout', async (req, res) => {
    const id = req.params.id;
    const profile = await Profile.findById(id);
    profile.loggedIn = false;
    profile.save();
    console.log(profile.userName, 'logged out');
    res.redirect('/');
})

app.use('/:id/profile', async (req, res, next) => {
    const profile = await Profile.findById(req.params.id);
    if(profile.loggedIn === true) {
        console.log(profile.userName, ' logged in');
        next();
    }
    else {
        res.render('./pages/error', {err: 'Log In first!!!!'});
        next();
    }
})

app.get('/:id/profile', async (req, res) => {
    const id = req.params.id;
    const profile = await Profile.findById(id);
    res.render('./pages/userProfile', {profile});
});

app.get('/:id/profile/allProfiles', async (req, res) => {
    const profiles = await Profile.find();
    res.render('./pages/allProfiles', {profiles});
})

app.get('*', (req, res) => {
    res.render('./pages/error', {err: "404 not found :/"})
})

app.listen(3000, ()=> {
    console.log('Listening of Port:3000');
})
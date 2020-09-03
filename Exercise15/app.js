const express = require('express');
const path = require('path');
const fs = require('fs');

// Initialization
const app = express();

// Settings
app.set('port', 3000);

// Middlewares
app.use(express.urlencoded({extended:false}));

// Static Files
app.use(express.static(path.join(__dirname, '/assets')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/login.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/register.html'));
});

app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/forgot-password.html'));
});

app.get('/about', (req, res) => {
    fs.readFile('counter.txt', (error, data) => {
        let views = data.toString();
        let viewsArray = views.split(':');
        let counter = parseInt(viewsArray[1]);
        counter++;
        fs.writeFile('counter.txt', `views:${counter}`, (error) => {
            if(error){
                console.log(error);
            }
            res.send('<h1>Views: ' + counter + '</h1>');
        });
    })
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/index.html'));
})

// Handle Register
app.post('/register', (req, res) => {
    fs.readFile('db.json', (error, data) => {
        if(error){
            console.log(error);
        }
        let users = JSON.parse(data.toString()); //Transformarlo a un objeto literal javascript para poder manipularlo
        users.push(req.body); //Voy agregar los datos que estoy recibiendo a través de la petición
        fs.writeFile('db.json', JSON.stringify(users), (error) => {
            if(error) { 
                console.log(error);
            }
            res.redirect('/');
        });
    });
});

// Handle login
app.post('/login', (req, res) => {
    let emailRequested = req.body.email;
    let passwordRequested = req.body.password;
    console.log([emailRequested, passwordRequested]);
    fs.readFile('db.json', (error, data) => {
        if(error){
            console.log(error);
        }
        let usersArr = JSON.parse(data);
        let userObj = usersArr.find(user => user.email.includes(emailRequested));
        console.log(userObj)
        if(userObj){
            if(userObj.password === passwordRequested){
                console.log('contraseña correcta');
                res.redirect('/index.html');
            } else {
                console.log('contraseña incorrecta');
                res.redirect('/login.html');
            }
        } else {
            console.log('usuario no encontrado');
            res.redirect('/login.html');
        }   
    })
})

// Start the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
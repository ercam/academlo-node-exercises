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

// Start the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
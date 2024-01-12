const express = require('express')
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // Assuming your Pug templates are in a 'views' directory

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'banking'
});


app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.render('homePAGE');
});

app.get('/contactus', (req, res) => {
    res.render('contactus');
});
app.get('/aboutus', (req, res) => {
    res.render('aboutus');
});



app.get('/filter', (req, res) => {
    res.render('filter');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})


app.get('/submit', (req, res) => {
    res.sendFile(__dirname + '/views/filter.pug');
});



db.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL database:', error);
    } else {
        console.log('Connected to MySQL database!');
    }
});



// submitting and saving the data of the filters vali form in sql database
app.post('/submit/filter', (req, res) => {
    const contents = req.body;

    console.log(contents);

    const StreamPref = req.body.stream;
    const AcademicMin = req.body.academic_min;
    const AcademicMax = req.body.academic_max;
    const FacultyMin = req.body.faculty_min;
    const FacultyMax = req.body.faculty_max;
    const InfrastructureMin = req.body.infrastructure_min;
    const InfrastructureMax = req.body.infrastructure_max;
    const PlacementMin = req.body.placement_min;
    const PlacementMax = req.body.placement_max;
    const SocialLifeMin = req.body.social_life_min;
    const SocialLifeMax = req.body.social_life_max;



    const values = [StreamPref, AcademicMin, AcademicMax, FacultyMin, FacultyMax, InfrastructureMin, InfrastructureMax, PlacementMin, PlacementMax, SocialLifeMin, SocialLifeMax];

    const query = 'SELECT * FROM colleges2  WHERE 1=1 AND Stream = ? AND Academic >= ? AND Academic <= ? AND Faculty >= ? AND Faculty <= ? AND Infrastructure >= ? AND Infrastructure <= ? AND Placement >= ? AND Placement <= ? AND Social_Life >= ? AND Social_Life <= ?';
    db.query(query, values, (err, results) => {
        console.log(values);
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).send('Error retrieving data from the database');
        }

        if (results.length === 0) {
            console.log('No matching records found.');
            console.log(values);
        } else {
            res.render('college_data', { college_data: results });
        }
    });
 
});



// Define a route to handle login vali form submissions
app.post('/login/submit', (req, res) => {
    const contents = req.body;

    console.log(contents);
    // Perform data validation and username uniqueness checks here
    const username = req.body.username;
    // const email = req.body.email;
    const password = req.body.password;
    // const phoneNumber = req.body.phone;

    const values = [username,password];


    // Insert user data into the database
    const query = 'select * from user_info where username = ? and password = ?';
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data: ' + err.message);
            res.status(500).send('An error occurred.');
        } else {
            if (result.length > 0) {
                // User exists
                // res.send('Welcome, ' + username); // You can customize the message
                res.redirect('/'); // Redirect to the homepage
            } else {
                // User does not exist
                res.redirect('/signup');
            }
        }
    });
});

app.post('/signup/submit', (req,res)=>{
    const contents = req.body;

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phone;

    const values = [username,password,phoneNumber,email];

    const query = 'INSERT INTO user_info (username, password, phone, email) VALUES (?, ?, ?, ?)';

    db.query(query, values,(err,result)=>{
        if (err) {
            console.error('Error inserting data: ' + err.message);
            res.status(500).send('An error occurred.');
        }else{
            // res.send('Successfully registered');
            res.redirect('/');
        }
    })
})


// app.get('/users', (req, res) => {
//     const Yname =
//         db.query('SELECT * FROM user_data where age >= 25 or Yname = "lalit"', (err, results) => {
//             if (err) {
//                 console.error('Error retrieving data:', err);
//                 return res.status(500).send('Error retrieving data from the database');
//             }

//             res.render('users', { users: results });
//         });
// });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})


app.use(express.static('static')); // Assuming your CSS is in a 'public' directory


process.on('exit', () => {
    db.end();
    console.log('MySQL connection closed');
});
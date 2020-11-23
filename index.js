let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const registration_numbers = require('./registration_numbers');
const flash = require('express-flash');
const session = require('express-session');
const routes = require('./routes')

const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://salizwa:salizwa123@localhost:5432/reg_number';
const pool = new Pool({
  connectionString
});

let app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(session({
  secret : "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

var registration_num = registration_numbers(pool)

var Routes = routes(registration_num)

app.get("/", Routes.homePage);

app.post("/reg_numbers", Routes.reg_numbers)

app.post("/reg_numbers_filter", Routes.reg_numbers_filter)

app.post("/reset", Routes.reset)


let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});
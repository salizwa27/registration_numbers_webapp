let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const registration_numbers = require('./registration_numbers')

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

var registration_num = registration_numbers(pool)

app.get("/", async function (req, res) {

  res.render("reg_num");
});

app.post("/reg_numbers", async function (req, res) {

  var textbox = req.body.registration_no;

  await registration_num.insertRegNum(textbox)
  var display = await registration_num.getRegNum(textbox)
  res.render("reg_num", {
    registrations: display
  })
})

app.get("/reg_numbers", async function (req, res){

  var towns = req.body.filtered
  var filter_reg = await registration_num.filter(towns)
  res.render("reg_num", {
    registrations: filter_reg
  })
})

app.get("/reset", async function (req, res) {
  reg_number.resetBtn();
  res.redirect("/")
})


let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});
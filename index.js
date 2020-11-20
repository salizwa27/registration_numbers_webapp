let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const registration_numbers = require('./registration_numbers');
const flash = require('express-flash');
const session = require('express-session');

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

app.get("/", async function (req, res) {

  res.render("reg_num");
});

app.post("/reg_numbers", async function (req, res) {

  var regNum = req.body.registration_no 

  var checkDuplicate = await registration_num.check_duplicates(regNum)
  
  
  if (regNum === ""){
    req.flash('error', "Enter Your Registration Number");
    // duplicates;
  } 
  else if (regNum.length > 10){
    req.flash('error', 'This registration is too long!')
  }
  else if (checkDuplicate !== 0) {
    req.flash('error', 'This registration is already entered!')
    //  duplicates;
  } 
  else if (regNum){
    await registration_num.insertRegNum(regNum)
   
    
    var display = await registration_num.getRegNum(regNum)
    req.flash('success', 'You have successfully added a registration number')
  } 

 //    else if (regNum.startsWith('CY ') || regNum.startsWith('CA ') || regNum.startsWith('CL ')) {
//     await registration_num.insertRegNum(regNum);
//     //reg;

// }
//    else if (!regNum.startsWith('CY ') || !regNum.startsWith('CA ') || !regNum.startsWith('CJ ')) {
//     req.flash('error', 'Enter a Registration as required: CA 123456/CA 123-456')
//    // reg;
// }
 
   
  
 

 res.render("reg_num", {
  registrations: display
  // registrations: duplicates
})

})

  

app.post("/reg_numbers_filter", async function (req, res){

  var town = req.body.filtered
  
  var filter_reg = await registration_num.filter(town)
  res.render("reg_num", {
    registrations: filter_reg
  })
})

app.post("/reset", async function (req, res) {
 

  await registration_num.resetBtn();
    req.flash('success', "counter has been reseted")

  

  
  res.redirect("/")
})


let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});
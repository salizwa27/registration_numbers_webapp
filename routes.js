module.exports = function routes (registration_num) {

    const registration = require("./registration_numbers");

    async function homePage (req, res) {

        var regNum = req.body.registration_no

        var display = await registration_num.getRegNum(regNum)
      
        res.render("reg_num", {
          registrations: display
        });
        
    }

    async function reg_numbers (req, res) {

        var regNum = req.body.registration_no 

        var checkDuplicate = await registration_num.check_duplicates(regNum)
        
        
        if (regNum === ""){
          req.flash('error', "Enter Your Registration Number");
         
        } 
        else if (regNum.length > 10){
          req.flash('error', 'This registration is too long!')
        }
        else if (checkDuplicate !== 0) {
          req.flash('error', 'This registration is already entered!')
          
        } 
        else if (regNum){
          await registration_num.insertRegNum(regNum)
         
          
          var display = await registration_num.getRegNum(regNum)
          req.flash('success', 'You have successfully added a registration number')
        } 
      
         res.render("reg_num", {
        registrations: display
       
      })

    }

    async function reg_numbers_filter (req, res){

  var town = req.body.filtered
  
  var filter_reg = await registration_num.filter(town)
  res.render("reg_num", {
    registrations: filter_reg
        })
    }

    async function reset (req, res){

        await registration_num.resetBtn();
    req.flash('success', "counter has been reseted")

  res.redirect("/")

    }

    return{
        homePage,
        reg_numbers,
        reg_numbers_filter,
        reset 
    }

}
module.exports = function reg_number(pool) {

    // var check = checkRegNum(town_name)

    // if (check === 0){
    //     insertRegNum
    // }

    async function insertRegNum(reg_entered) {

        var code = reg_entered.substring(0, 2)
        console.log(code)

        const id = await pool.query(`select id from town where starting_string = $1`, [code])
        const reg_id = id.rows[0].id

       // console.log(reg_id);
        let reg_num
        if (reg_id > 0) {
            reg_num = await pool.query('select * from registration_numbers where registrations = $1', [reg_entered])
            const insertRegNumber = await pool.query('insert into registration_numbers (registrations, town_id) values ($1,$2)', [reg_entered, reg_id])

// console.log(reg_num);
        } else if (reg_num.rowCount === 0) {
            const insertRegNumber = await pool.query('insert into registration_numbers (registrations, town_id) values ($1,$2)', [reg_entered, reg_id])
            //return insertRegNumber.rows
        } else {
            return false
        }


        // const send_id = await pool.query('select reg')
        // const insertRegNumber = await pool.query('insert into registration_numbers (registrations, town_id) values ($1,$2)', [reg_entered])
        // return insertRegNumber.rows;


    }

    async function filter(id){
        if (id === `all`) {
            return await getRegNum()
        } else {

            const selected_town = await pool.query('select registrations from registration_numbers where town_id = $1', [id])
            return selected_town.rows

        }
    }

    async function getRegNum() {
        const registration = await pool.query('select registrations from registration_numbers')
        return registration.rows;
    }

    async function checkRegNum(town_id) {
        const registration = await pool.query('select town_id from registration_numbers (registrations, town_id) where start_string $=1', [start_string(0, 2)])
        return registration.rowCount;
    }

    async function resetBtn() {
        await pool.query('delete from registration_numbers')

    }

    return {
        insertRegNum,
        getRegNum,
        checkRegNum,
        resetBtn,
        filter
    }

}
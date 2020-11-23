module.exports = function reg_number(pool) {

    async function insertRegNum(reg_entered) {

        var code = reg_entered.substring(0, 2)
       
        const id = await pool.query(`select id from town where starting_string = $1`, [code])
        const reg_id = id.rows[0].id

        let reg_num
        if(reg_entered.length <= 10){
        if (reg_id > 0) {
            reg_num = await pool.query('select * from registration_numbers where registrations = $1', [reg_entered])
            
            if (reg_num.rowCount === 0) {
                const insertRegNumber = await pool.query('insert into registration_numbers (registrations, town_id) values ($1,$2)', [reg_entered, reg_id])
                
                return true
            }
            return false;

        } 
        }

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

    async function check_duplicates(reg_entered) {
        let duplicates = await pool.query('select registrations from registration_numbers where registrations = $1', [reg_entered])
        return duplicates.rowCount;
    }

    async function resetBtn() {
        await pool.query('delete from registration_numbers')

    }

    return {
        insertRegNum,
        getRegNum,
        resetBtn,
        filter,
        check_duplicates
    }

}
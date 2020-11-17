const assert = require('assert');
const registrations_num = require('../registration_numbers');
const pg = require("pg");
const Pool = pg.Pool;

// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://salizwa:salizwa123@localhost:5432/registration_numbers_tests';

const pool = new Pool({
    connectionString
});

var Registrations_num = registrations_num(pool)

describe('The registration_numbers function', function() {


    beforeEach(async function() {
        // clean the tables before each test run
        await pool.query("delete from registration_numbers;");

    });

    it('should return all registrations from database', async function() {
        
        await Registrations_num.insertRegNum("CY 789 546");
        await Registrations_num.insertRegNum("CA 123 456");
        await Registrations_num.insertRegNum("CJ 789 258")

        assert.deepStrictEqual(await Registrations_num.getRegNum(), [{ registrations: "CY 789 546" },
            { registrations: "CA 123 456" },
            { registrations: "CJ 789 258" },

        ]);

    });

})

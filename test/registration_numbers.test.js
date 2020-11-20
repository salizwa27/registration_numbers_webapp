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
        
        await Registrations_num.insertRegNum("CY 123456");
        await Registrations_num.insertRegNum("CA 741852");
        await Registrations_num.insertRegNum("CJ 852963");
        await Registrations_num.insertRegNum("CJ 666999")

        assert.deepStrictEqual(await Registrations_num.getRegNum(), [{ registrations: "CY 123456" },
            { registrations: "CA 741852" },
            { registrations: "CJ 852963" },
            { registrations: "CJ 666999" },

        ]);

    });

    it('should filter and return Bellville registrations only', async function() {

        await Registrations_num.insertRegNum("CY 852963");
        await Registrations_num.insertRegNum("CY 147852");
        await Registrations_num.insertRegNum("CA 369852");
        await Registrations_num.insertRegNum("CJ 987654")

        assert.deepStrictEqual(await Registrations_num.filter(2), [{ registrations: "CY 852963" },
            { registrations: "CY 147852" }
        ])
    });

    it('should filter and return Cape Town registrations only', async function() {

        await Registrations_num.insertRegNum("CY 123 666");
        await Registrations_num.insertRegNum("CY 789 546");
        await Registrations_num.insertRegNum("CA 123 456");
        await Registrations_num.insertRegNum("CJ 789 258")

        assert.deepStrictEqual(await Registrations_num.filter(1), [{ registrations: "CA 123 456" },
        ])
    });

    it('should filter and return Paarl registrations only', async function() {

        await Registrations_num.insertRegNum("CY 285963");
        await Registrations_num.insertRegNum("CJ 456123");
        await Registrations_num.insertRegNum("CA 123456");
        await Registrations_num.insertRegNum("CA 895425")

        assert.deepStrictEqual(await Registrations_num.filter(3), [{ registrations: "CJ 456123" }, 
        // { registrations: "CJ 895425" }
        ])
    });

    it('should not add duplicate for Bellville', async function() {
       
        await Registrations_num.insertRegNum("CA 895425")


        assert.equal(1, await Registrations_num.check_duplicates("CA 895425"));


    });

})

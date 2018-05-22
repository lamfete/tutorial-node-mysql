const { saltHashPassword } = require('../store')

exports.up = async function up(knex, Promise) {
    await knex.schema.table('users', t => {
        t.string('salt').notNullable()
        t.string('encrypted_password').notNullable()
    })

    const user = await knex('users')
    await Promise.all(user.map(convertPasword))
    await knex.schema.table('users', t => {
        t.dropColumn('password')
    })

    function convertPasword(user) {
        const { salt, hash } = saltHashPassword(user.password)
        return knex('users')
            .where({id: user.id })
            .update({
                salt,
                encrypted_password: hash
            })
    }
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', t => {
        t.dropColumn('salt')
        t.dropColumn('encrypted_password')
        t.string('password').notNullable()
    })
};

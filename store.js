const knex = require('knex') (require('./knexfile'))
const crypto = require('crypto')

module.exports = {
    saltHashPassword,
    createUser({ username, password }) {
        // console.log('Add user ${username} with password ${password}') //contoh salah penggunaan petik
        console.log(`Add user ${username}`)
        const {salt, hash} = saltHashPassword(password)
        return knex('users').insert({
            salt,
            encrypted_password: hash,
            username
        })
    }
}

function saltHashPassword(password) {
    const salt = randomString()
    const hash = crypto
        .createHmac('sha512', salt)
        .update(password)
    return {
        salt,
        hash: hash.digest('hex')
    }
}

function randomString() {
    return crypto.randomBytes(4).toString('hex')
}
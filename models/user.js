const db = require("monk")('mongodb+srv://tahmid:526628Tahmid@test1.mbzeo.mongodb.net/gapguysblog?retryWrites=true&w=majority');
const bcrypt = require('bcryptjs');


const findUserByUsername = module.exports.findUserByUsername = (username, callback) => {
    let members = db.get('members')
    let query = {username: username}
    
    members.find(query, (err, user)=> {
        if(err){
            return callback(err)
        }
        callback(null, user[0])
    })
}

const encryptPassword = module.exports.encryptPassword = (password, callback) => {
    let salt = Math.floor(Math.random() * 20)
    bcrypt.hash(password, salt, (err, hashPass) => {
        if(err) {
            return callback(err);
        }
        password = hashPass;
        return callback(null, hashPass);
    })
}

const comparePassword = module.exports.comparePassword = (candidatePassword, userPassword, callback) => {
    bcrypt.compare(candidatePassword, userPassword, (err, isMatch) => {
        if(err){
            return callback(err)
        }
        callback(null, isMatch)
    })
}

const findUserById = module.exports.findUserById = (id, callback) => {
    let members = db.get('members')
    let query = {_id: id}
    
    members.find(query, (err, user)=> {
        if(err){
            return callback(err)
        }
        callback(null, user[0])
    })
}

// let username = 'tahmid78'
// findUserByUsername(username, (err, user) => {
//     if(err) throw err;
//     if(user.length === 0) console.log('not a user');
//     else{
//         console.log(user)
//         console.log(user.length)
//         console.log(user[0].password)
//     }
// })

// let candidatePassword = '#526628Tahmi';
// let userPass = '#526628Tahmid';
// comparePassword(candidatePassword, userPass, (err, isMatch) => {
//     if(!isMatch){
//         console.log('vul pass')
//     }else{
//         console.log('correct')
//     }

// })


// encryptPassword('123456', (err, encPass) => {
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(null, encPass);
//     }
// })

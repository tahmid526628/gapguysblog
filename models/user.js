const db = require("monk")('mongodb+srv://tahmid:526628Tahmid@test1.mbzeo.mongodb.net/gapguysblog?retryWrites=true&w=majority');

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

const comparePassword = module.exports.comparePassword = (candidatePassword, userPassword, callback) => {
    if(candidatePassword === userPassword){
        return callback(null, true)
    }
    return callback(null, false)
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


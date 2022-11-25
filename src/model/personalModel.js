const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const personalList = new mongoose.Schema({

    userId: {
        type: objectId,
        required: true,
        ref: 'Users'
    },
    Personal_Books:[{
        type: objectId,
        required: true,
        
    }]
},
 { timesStamp: true })

module.exports = mongoose.model('List', personalList)
const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema({

    title:
    {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: objectId,
        required: true,
        ref: 'Users'
    },
    ISBN: {
        type: String,
        required: true,
         unique:true
    },
    deletedAt: { type: Date },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports=mongoose.model('Books',bookSchema)
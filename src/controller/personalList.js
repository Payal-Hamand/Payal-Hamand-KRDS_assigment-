const personalList = require("../model/personalModel")
const { default: mongoose } = require('mongoose')
const userModel = require('../model/userModel')
// const moment = require('moment')
const bookModel = require('../model/bookModel')

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const list = async function(req,res){
    try{
        const data= req.body
        const {userId,Personal_Books} = data
        if (!isValidObjectId(Personal_Books)) 
        return res.status(400).send({ status: false, message: "bookId is not valid" })
        const getBook = await bookModel.findOne({ _id: Personal_Books, isDeleted: false });
        if (!getBook) return res.status(404).send({ status: false, message: "No Book Found" });
        if (!isValidObjectId(userId)) 
        return res.status(400).send({ status: false, message: "userId is not valid" })
        const createlist = await personalList.create(data)
        res.status(200).send({status:true,data:createlist})
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }

}

const getlist= async function (req, res) {
    let books = await personalList.find()
    
    res.send({data: books})
}

module.exports={ list,getlist}
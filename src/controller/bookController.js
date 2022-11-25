const { default: mongoose } = require('mongoose')
const userModel = require('../model/userModel')
// const moment = require('moment')
const bookModel = require('../model/bookModel')


const isValid = function (value) {

    if (typeof (value) === 'undefined' || typeof (value) === "null") { return false }

    if (typeof (value) === "string" && value.trim().length == 0) { return false }

    return true

}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length == 0
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const createBooks = async function (req, res) {
    let data = req.body

    if (isValidRequestBody(data)) {
        return res.status(400).send({ status: false, message: 'Please provide input' })
    }

    let { title, userId, ISBN } = data

    if (!isValid(title)) {
        return res.status(400).send({ status: false, message: 'Please provide title' })
    }

    if (!isValid(userId)) {
        return res.status(400).send({ status: false, message: 'Please provide userId' })
    }

    if (!isValid(ISBN)) {
        return res.status(400).send({ status: false, message: 'Please provide ISBN' })
    }


    if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: 'Please provide valid objectID' })
    }


    let checkTitle = await bookModel.findOne({ title: data.title })
    if (checkTitle) {
        return res.status(400).send({ status: false, msg: "Title already exist" })
    }


    let checkISBN = await bookModel.findOne({ ISBN: data.ISBN })
    if (checkISBN) {
        return res.status(400).send({ status: false, msg: "ISBN already exist" })
    }
    let checkUserId = await userModel.findById(data.userId);
    if (!checkUserId) {
        return res.status(404).send({ status: false, msg: " UserId is required or not valid" });
    }

    if (!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).test(data.ISBN)) {
        return res.status(400).send({ status: false, message: 'ISBN should be a valid' })
    }


    let saveData = await bookModel.create(data)

    res.status(201).send({ status: true, message: 'success', data: saveData })
}


/******************************************************************************** */

const getBooks = async function (req, res) {
    try {
        let data = req.query

        if (!isValidObjectId(data.userId) && data.userId) {
            return res.status(400).send({ status: false, message: 'Please provide valid objectID' })
        }
        // find the all data filter and query

        let books = await bookModel.find({ $and: [{ isDeleted: false }, data] });

        // check data exits or not
        if (books.length <= 0) {
            return res.status(404).send({ status: false, msg: 'Data Not Found' })
        }
        return res.status(200).send({ status: true,message:"Books list", data: books })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


/************************************************************************ */
const updateBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const requestUpdateBody = req.body
        const { title, ISBN } = requestUpdateBody
        const ISBNRagex = /^[\d*\-]{10}|[\d*\-]{13}$/
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })
        if (isValidRequestBody(requestUpdateBody)) return res.status(400).send({ status: false, message: "Please Provide something to Update" })

        if (title) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "Title Should be Valid..." })
            if (await bookModel.findOne({ title })) return res.status(400).send({ status: false, message: "Title Already Used by Someone.. or You Already Updated it With Provided Title" })
        }
        
        if (ISBN) {
            if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN Should be Valid..." })
            if (!ISBN.match(ISBNRagex)) return res.status(400).send({ status: false, message: "ISBN Should only contain Number and - and length of 10 and 13 only " })
            if (await bookModel.findOne({ ISBN })) return res.status(400).send({ status: false, message: "ISBN Already Used by Someone... or You Already Updated it With Provided ISBN" })
        }
    

        const getBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!getBook) return res.status(404).send({ status: false, message: "No Book Found" });

        const updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId }, { title: title, ISBN: ISBN }, { new: true })  //releaseAt
        res.status(200).send({ status: true, message: "update successfully", data: updatedBooks })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}


/******************************************************************************** */

 module.exports.getBooks = getBooks;
module.exports.updateBookById=updateBookById
module.exports.createBooks = createBooks

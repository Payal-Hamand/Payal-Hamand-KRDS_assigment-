const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const personalList = require('../controller/personalList')
const passport = require('passport')


router.get('/login',(req,res)=>{
    res.send("<button><a href='/auth'>Login</a></button>")
})
router.get('/auth' , passport.authenticate('google', { scope:
    [ 'email', 'profile' ]
}));
 
router.get('/auth/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
}));
  
router.get('/auth/callback/success' , (req , res) => {

    // 
    // console.log(req.user)
    if(!req.user)

        return res.redirect('/login');
    // // user is in DB? , Add user in DB

    // res.send("Welcome " + req.user.email);
});
  

const isAuthenticated = (req, res,next) =>{
    try{ 
    if(req.isAuthenticated()) {return next()}
    else res.redirect('/')
    }
    catch(err){
        res.status(500).json({error:err.message})

    }
}


router.get("/protected", isAuthenticated ,(req,res)=>{
    res.send("PROTECTED")
})

router.get('/auth/callback/failure' , (req , res) => {
    res.send("Error");
})



router.post('/register',userController.createUser)

router.post('/login',userController.loginUser)

router.post('/books',bookController.createBooks)

router.get("/getbooks", bookController.getBooks);

router.post('/list', isAuthenticated.personalList. list)
router.get("/fetchBooks",isAuthenticated.personalList.getlist)
// getlist
// router.get("/books/:bookId", bookController.getBookById);

// router.put('/books/:bookId',bookController.updateBookById)
module.exports = router

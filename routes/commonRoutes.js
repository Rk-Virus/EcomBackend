const express = require("express");
const router = express.Router()

const {
     fetchUser, 
            registerUser, 
            loginUser, 
            getAllOffers, 
            updateProfile, 
            updatePassword, 
        } = require("../controllers/commonControllers");

const isAuthenticated = require("../middlewares/isAuthenticated");
const {validateUserSignUp, userValidation} = require('../middlewares/validation/user')

router.post("/register",
 validateUserSignUp, userValidation, 
 registerUser)
router.post("/login", loginUser)
router.get("/fetch-user",
//  isAuthenticated,
 fetchUser)
router.post("/update-profile", isAuthenticated, updateProfile)
router.get("/get-all-offers",  getAllOffers)
// router.get('/get-offer-details/:offerId', getsingleOffer)
// router.post('/check-if-user-exist', checkIfUserExist)
router.post('/reset-password', updatePassword)

module.exports = router
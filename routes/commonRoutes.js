const express = require("express");
const router = express.Router()

const {
     fetchUser, 
            logoutUser, 
            registerUser, 
            loginUser, 
            getAllOffers, 
            // getsingleOffer, 
            updateProfile, 
            // checkIfUserExist, 
            updatePassword, 
            // getSignedUrlForS3,
            // deleteImagesFromS3
        } = require("../controllers/commonControllers");

const isAuthenticated = require("../middlewares/isAuthenticated");
const {validateUserSignUp, userValidation} = require('../middlewares/validation/user')

router.post("/register",
 validateUserSignUp, userValidation, 
 registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/fetch-user",
//  isAuthenticated,
 fetchUser)
router.post("/update-profile", 
// isAuthenticated,
 updateProfile)
router.get("/get-all-offers",  getAllOffers)
// router.get('/get-offer-details/:offerId', getsingleOffer)
// router.post('/check-if-user-exist', checkIfUserExist)
router.post('/reset-password', updatePassword)

// router.post('/get-signed-url', getSignedUrlForS3)
// router.post('/delete-image-from-s3', deleteImagesFromS3)

module.exports = router
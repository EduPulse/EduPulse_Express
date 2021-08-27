const express = require('express');
const User = require('../models/user');
const upload = require('../modules/multer')
const cloudinary= require('../modules/cloudinary')

var router = express.Router();

router.post('/uploadProfPic', upload.single("media"), async function(req, res){
    // https://dev.to/itsmefarhan/cloudinary-files-images-crud-operations-with-nodejs-express-multer-2147
    
    
    // try {
    //     console.log(req.body);

    //     result = await cloudinary.uploader.upload(req.file.path, {folder: 'Profile_Pictures', unique_filename: true});

    //     let userID = req.body._id;

    //     User.findByIdAndUpdate({_id: userID}, {
    //         //profilePicture = result.secure_url
    //         profilePicture = result
    //     })
    // } catch (error) {
    //     res.sendStatus(500)
    // }

    router.put("uploadProfPic", upload.single("media"), async (req, res) => {
        try {
            let user = await User.findById(req.body._id);
            await cloudinary.uploader.destroy(user.cloudinary_id);
            const result = await cloudinary.uploader.upload( req.file.path, {folder: 'Profile_Pictures', unique_filename: true} );
            const data = {
                profilePicture: result.secure_url
            };
            user = await User.findByIdAndUpdate(req.body._id, data, {
                new: true
            });
            res.json(user);
        } catch (err) {
            console.log(err);
        }
    });
})

router.post('/removeProfPic', function(req, res) {
    // try {
    //     console.log(req.body);

    //     let userID = req.body._id;

    //     User.findByIdAndUpdate({_id: userID}, {
    //         profilePicture = ''
    //     })
    // } catch (error) {
    //     res.sendStatus(500)
    // }

    router.delete("/removeProfPic", async (req, res) => {
        try {
            let user = await User.findById(req.body._id);
            await cloudinary.uploader.destroy(user.cloudinary_id);
            await user.remove();
            res.json(user);
        } catch (err) {
            console.log(err);
        }
    });

})
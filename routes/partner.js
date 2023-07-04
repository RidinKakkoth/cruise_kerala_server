const express=require('express')

const router=express.Router()

const {partnerSignUp,partnerSignin,getPartnerData,updateProfilePic,proofUpload}=require("../controllers/partnerController")

// const multer = require("multer")
// const path = require('path')
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__dirname,"../public/partnerProfileImages"),function(error,success){
//             if(error){
//                 console.log(error);
//             }
//         })
//     },
//     filename:function(req,file,cb){
//         const name = Date.now()+"-"+file.originalname;
//         cb(null,name,function(error,success){
//             if(error){
//                 console.log(error);
//             }
//         })
//     }
// })
// const upload = multer({storage:storage})

const multer = require("multer")
const path = require('path')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../public/files"),function(error,success){
            if(error){
                console.log(error);
            }
        })
    },
    filename:function(req,file,cb){
        const name = Date.now()+"-"+file.originalname;
        cb(null,name,function(error,success){
            if(error){
                console.log(error);
            }
        })
    }
})
const upload = multer({storage:storage})



router.post('/partnerSignUp',partnerSignUp)
router.post('/partnerSignin',partnerSignin)
router.get('/getPartnerData',getPartnerData)
router.post('/partner-dp',upload.single('image'),updateProfilePic)
router.post('/proof-upload',upload.single('file'),proofUpload)


module.exports =router
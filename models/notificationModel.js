const mongoose = require("mongoose");

const notificationSchema=new mongoose.Schema({
    message:{
        type:String
    },
    notification:{
        type:String
    },
    status:{
        type:String
    }
},
{
    timestamps:true,
}
)

module.exports=mongoose.model('notifications',notificationSchema)

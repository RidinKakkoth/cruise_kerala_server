const mongoose = require('mongoose');



const CruiseSchema = new mongoose.Schema({
  name: { type: String, required: true },
//   category: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref:"category", required: true },
  description: { type: String, required: true },
  boarding: { type: String, required: true },
  town: { type: String, required: true },
  district: { type: String, required: true },
  pin: { type: Number, required: true },
  rooms: { type: Number, required: true },
  baseRate: { type: Number, required: true },
  extraRate: { type: Number, required: true },
  maxGuest: { type: Number, required: true },
  review:[{
        ratings:{
            type:Number
        },
        feedback:{
            type:String
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },created:{
            type:Date,
            default:Date.now()
        }
  }],
  Images: {type:Array},
  Facilities: [{
    AC:{
        type:Boolean,
        default:true
    },
    food:{
        type:Boolean,
        default:true
    },
    TV:{
        type:Boolean,
        default:true
    },
    Pets:{
        type:Boolean,
        default:true
    },
    partyHall:{
        type:Boolean,
        default:true
    },
    fishing:{
        type:Boolean,
        default:true
    },

    games:{
        type:Boolean,
        default:true
    },
    wifi:{
        type:Boolean,
        default:true
    }
     }],
  isBlocked: { type: Boolean,default:false },
  Liscence:{type:String,required:true},
  isApproved:{type:String,default:"pending"},
  partnerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"partner"
}
},{timestamps:true});

module.exports=mongoose.model('Cruise', CruiseSchema);




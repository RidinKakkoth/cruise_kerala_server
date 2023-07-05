const mongoose = require('mongoose');



const CruiseSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Category: { type: String, required: true },
  Description: { type: String, required: true },
  BoardingPoint: { type: String, required: true },
  Town: { type: String, required: true },
  District: { type: String, required: true },
  Pin: { type: Number, required: true },
  Rooms: { type: Number, required: true },
  BasePrice: { type: Number, required: true },
  AddGuestPrice: { type: Number, required: true },
  MaxGuest: { type: Number, required: true },
  Images: {type:Array},
  Facilities: [{
    AC:{
        type:Boolean,
        default:true
    },
    Food:{
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
    PartyHall:{
        type:Boolean,
        default:true
    },
    Fishing:{
        type:Boolean,
        default:true
    },

    Games:{
        type:Boolean,
        default:true
    },
    WiFi:{
        type:Boolean,
        default:true
    }
     }],
  IsBlocked: { type: Boolean },
  Liscence:{type:String,required:true},
  isApproved:{type:String,default:"pending"},
  partnerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"partner"
}
},{timestamps:true});

module.exports=mongoose.model('Cruise', CruiseSchema);




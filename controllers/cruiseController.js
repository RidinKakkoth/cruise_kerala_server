const Cruise=require('../models/cruiseModel')
const Partner=require('../models/partnerModel')
const Category=require('../models/categoryModel')
const Notification=require('../models/notificationModel')
const Booking=require('../models/bookingModel')
const Coupon=require("../models/couponModel")
const cloudinary=require("../middleware/cloudinaryConfig")
const jwt=require("jsonwebtoken")

const addCruiseData=async (req,res)=>{
    try {
      
      const licenseFile = req.files.license[0].path;
         const imageFilenames = req.files.images

       const Images = [];

       for (const file of imageFilenames) {
         const result = await cloudinary.uploader.upload(file.path);
       Images.push(result.secure_url);
      }
   
      const licenseResult=await cloudinary.uploader.upload(licenseFile)
      
      const{ name,category,description,boarding,town,district,pin,rooms,baseRate,extraRate,maxGuest,AC,food,TV,partyHall,games,fishing,wifi,pets}=req.body
      const partnerId=req.id
      if(!partnerId){
       return res.status(401).json({ error: 'Invalid token' });
      }
      const partnerData= await Partner.findById(partnerId)

        const newCruise=new Cruise({
          partnerId,name,category,description,boarding,town,district,pin,rooms,baseRate,extraRate,maxGuest,
          Facilities: [{AC,food, TV, pets, partyHall,fishing,games, wifi }],
          Images,
          Liscence:licenseResult.secure_url
        })
        const addedCruise= await newCruise.save()
        
        
        const x= await Notification.create({
          message:'Partner added new cruise',
          notification:`Partner ${partnerData.name} added new cruise ${newCruise.name} `,
          status:'warning'
        })

     if(addedCruise)
    { 
    
     return res.send({status:true,message:"success"})}

    } catch (error) {
      res.status(500).json({error:'Internal server error'});
    }
  }


const getPartnerCruiseData=async(req,res)=>{
    try {

        const partnerId=req.id

      
        if(!partnerId){
          return  res.status(401).json({ error: 'Invalid token' });
           }
           const partner=await Partner.findById(partnerId)

          const cruiseData=await Cruise.find({partnerId}).populate('category')
          if(!cruiseData){
            return res.status(404).json({error:"not found"})
          }
          return res.status(200).json({cruiseData,partner})

        
    } catch (error) {
        res.status(500).json({error:'Internal server error'});
    }
}

//<==================================== block cruise  ==================================>

const blockCruise=async(req,res)=>{
  try {

    const cruiseId=req.query.id
   

       const cruideData=await Cruise.findById(cruiseId)
   
       if(!cruideData){
         return res.status(404).json({error:"cruise not found"})
       }
   
      cruideData.isBlocked = !cruideData.isBlocked;
       const updateData = await cruideData.save();

       await Notification.create({
        message:'Cruise blocked',
        notification:`Cruise ${updateData.name} has blocked ! `,
        status:'danger'
      })
   
    res.status(200).json({ message:"success" });
   
     } catch (error) {
   
       console.error(error);
       res.status(500).json({ error: "Internal server error" });
     }
}

//<==================================== get cruise data ==================================>

const getCruiseData=async(req,res)=>{
  try {

    const data=await Cruise.find({ isBlocked:false, isApproved:"verified"}).populate("category")

    if(data){
     const categoryData= await Category.find()

     if(!categoryData){
      return res.status(404).json({error:"cruise not found"})
     }
     res.send({data,categoryData})
    }
      
 

} catch (error) {
res.status(401).send({ error: "Unauthorized" });
}


}



//<====================================  cruise approval ==================================>

const cruiseApproval=async(req,res)=>{
  try {
  
 const cruiseId=req.query.id
 const status=req.query.result
 


if(!cruiseId){
  return res.status(404).json({error:"invalid"})
}
    const cruiseData=await Cruise.findById(cruiseId)

    if(!cruiseData){
      return res.status(404).json({error:"partner not found"})
    }

    cruiseData.isApproved = status;
    const updateData = await cruiseData.save();

    res.status(200).json({status, message: "success" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//<==================================== add category ==================================>

const addCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName;
    const existing = await Category.find({ name: categoryName });

    if (existing.length > 0) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const savedCategory = await Category.create({ name: categoryName });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//<==================================== get categories ==================================>

const getCategories=async(req,res)=>{
  try {
    const categories=await Category.find()
    if(categories.length>0){
      res.status(200).json({categories, message: "Success" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
//<==================================== edit category ==================================>
const editCategory=async(req,res)=>{
  try {
    const categoryId=req.params.id
    const {name}=req.body
    const categoryData=await Category.findById(categoryId)
    if(!categoryData){
      res.status(404).json({error:"not found"});
    }
    categoryData.name=name
    await categoryData.save()
    res.status(200).send({categoryData,message:"success"})

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


//<==================================== single view cruise data ==================================>

const singleView=async(req,res)=>{

  try {

    const cruiseId=req.params.id
   
   if(!cruiseId){
     return res.status(404).json({error:"invalid"})
   }
       const cruiseData=await Cruise.findById(cruiseId).populate('review.userId');
   
       if(!cruiseData){
         return res.status(404).json({error:"cruise not found"})
       }

        res.status(200).json({ cruiseData });
   
     } catch (error) {
   
       console.error(error);
       res.status(500).json({ error: "Internal server error" });
     }
}
//<==================================== cancel booking ==================================>
const cancelBooking=async(req,res)=>{
  try {

    const bookingId=req.params.id

    const bookingData=await Booking.findById(bookingId)
    if(!bookingData){
      return res.status(404).json({error:"booking not found"})
    }
    bookingData.status="Cancelled"
    bookingData.save()
    res.status(200).json({ bookingData });
  } catch (error) {
    console.log(error);
  }
}

//<==================================== edit cruise data ==================================>

const editCruiseData=async (req,res)=>{
  try {
    
    // const licenseFile = req.files.license[0].filename;
    // const imageFilenames = req.files.images.map((file) => file.filename);//===============>+++++++
    // console.log(imageFilenames,"9999999999999999");

    const{ name,category,description,boarding,town,district,pin,rooms,baseRate,extraRate,maxGuest,AC,food,TV,partyHall,games,fishing,wifi,pets}=req.body
 
    const updateData={
      name,category,description,boarding,town,district,pin,rooms,baseRate,extraRate,maxGuest,
      Facilities: [{AC,food, TV, pets, partyHall,fishing,games, wifi }]
    }
    const cruiseId=req.query.id

    if(!cruiseId){
     return res.status(401).json({ error: 'Invalid ' });
    }
    // const cruiseData= await Cruise.findById({cruiseId})
         const updatedCruise = await   Cruise.findByIdAndUpdate(cruiseId,{$set:updateData},{ new: true })


   await Notification.create({
    message:'Partner added new cruise',
    notification:`Partner updated ${updatedCruise.name} details `,
    status:'warning'
  })
   if(updatedCruise)
   res.status(200).send({status:true,message:"success"})

  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }
}


module.exports={singleView,getPartnerCruiseData,getCruiseData,editCruiseData,addCruiseData,blockCruise,cruiseApproval,addCategory,getCategories,editCategory,cancelBooking}
const Cruise=require('../models/cruiseModel')
const Partner=require('../models/partnerModel')
const Category=require('../models/categoryModel')
const jwt=require("jsonwebtoken")

const verification=(req)=>{
    const jwtToken=req.cookies.partnerCookie.token
  
    const decodedToken=jwt.verify(jwtToken,"secretCodeforPartner")
  
    const partnerId=decodedToken.id
  
    return partnerId
  }

const addCruiseData=async (req,res)=>{
    try {
      
      const licenseFile = req.files.license[0].filename;
      const imageFilenames = req.files.images.map((file) => file.filename);

      const{ name,category,description,boarding,town,district,pin,rooms,baseRate,extraRate,maxGuest,AC,food,TV,partyHall,games,fishing,wifi,pets}=req.body
      const partnerId=verification(req)

      if(!partnerId){
       return res.status(401).json({ error: 'Invalid token' });
      }
      const newCruise=new Cruise({
        partnerId,name,category,description,boarding,town,district,pin,rooms,baseRate,extraRate,maxGuest,
        Facilities: [{AC,food, TV, pets, partyHall,fishing,games, wifi }],
        Images:imageFilenames,
        Liscence:licenseFile
      })
      
     const addedCruise= await newCruise.save()
     if(addedCruise)
     res.status(200).send({success:true,message:"success"})

    } catch (error) {
      res.status(500).json({error:'Internal server error'});
    }
  }


const getPartnerCruiseData=async(req,res)=>{
    try {



        const partnerId=verification(req)
      
        if(!partnerId){
          return  res.status(401).json({ error: 'Invalid token' });

          }

          const cruiseData=await Cruise.find({partnerId})
          if(!cruiseData){
            return res.status(404).json({error:"not found"})
          }
          return res.status(200).json({cruiseData})

        
    } catch (error) {
        res.status(500).json({error:'Internal server error'});
    }
}

const blockCruise=async(req,res)=>{
  try {

    const cruiseId=req.query.id
   

       const cruideData=await Cruise.findById(cruiseId)
   
       if(!cruideData){
         return res.status(404).json({error:"cruise not found"})
       }
   
      cruideData.isBlocked = !cruideData.isBlocked;
       const updateData = await cruideData.save();

   
    res.status(200).json({ message:"success" });
   
     } catch (error) {
   
       console.error(error);
       res.status(500).json({ error: "Internal server error" });
     }
}


const getCruiseData=async(req,res)=>{
  try {
    Cruise.find().then((data)=>{
          res.send(data)
    }).catch((error)=>{
      res.status(500).send({error:error.message})
    })

// }

} catch (error) {
res.status(401).send({ error: "Unauthorized" });
}


}


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


const singleView=async(req,res)=>{

  try {

    const cruiseId=req.params.id
   
   if(!cruiseId){
     return res.status(404).json({error:"invalid"})
   }
       const cruiseData=await Cruise.findById(cruiseId)
   
       if(!cruiseData){
         return res.status(404).json({error:"cruise not found"})
       }

        res.status(200).json({ cruiseData });
   
     } catch (error) {
   
       console.error(error);
       res.status(500).json({ error: "Internal server error" });
     }
}
  
  



module.exports={singleView,getPartnerCruiseData,getCruiseData,addCruiseData,blockCruise,cruiseApproval,addCategory,getCategories}
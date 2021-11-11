require("../models/mongo");
const Groccery = require("../models/gorcceryData");
const express = require("express");
const router = express.Router();



router.get("/getAll", async (req, res) => {
  try {
    const grocceryItems = await Groccery.find();
    res.status(200).send(grocceryItems);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


router.post("/add",async (req,res)=>{
    console.log("Add Data Successfully")
    const itemDetails = new Groccery({
        ...req.body,
        isPurchased:false
    })
    try {
        await itemDetails.save()
        res.status(201).send("success")
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/updatePurchaseStatus',async(req,res)=>{
    try {
        await Groccery.findByIdAndUpdate({
            _id:req.body.id
        },{
            isPurchased:true
        })
        res.status(201).send("success")
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/deleteGrocceryItem',async(req,res)=>{
    console.log("Delete Data Successfully")
    console.log('del',req.body)
    
    try {
        await Groccery.findByIdAndDelete({_id:req.body.id})
        res.status(200).send("Success")
    } catch (error) {
        res.status(400).send(error)   
    }
})

module.exports = router;

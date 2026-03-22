import Feedback from "../models/Feedback.js";

export const sendFeedBack = async(req,res)=>{
    try {

        const {shopId , salespersonId, rating, customerPhone} = req.body;

        if(!shopId || !salespersonId || !rating){
            return res.status(404).json({success : false , message : "Enter Valid data"})
        }

        const response = await Feedback.create({
            shopId,
            salespersonId,
            rating,
            customerPhone
        })

        res.status(200).json({success : true , message : "Thanks For Your Feeback" , response});
    } catch (error) {
        console.log("Delete Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getShopFeedback =async(req,res)=>{
    try {
        const {shopId} = req.params;
        console.log(shopId)
        if(!shopId){
            return res.status(404).json({success : false , message : "Please Provide Valid Id"})
        }
        
        const feedback = await Feedback.find({shopId : shopId})

        console.log(feedback)
        res.status(200).json({success : true , message : "Feedback Listings" , feedback})

    } catch (error) {
        console.log("Delete Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
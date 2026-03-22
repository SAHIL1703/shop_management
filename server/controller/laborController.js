import Labor from "../models/Labor.js";
import Shop from "../models/Shop.js";
import { updateProduct } from "./productController.js";

export const createLabor = async (req, res) => {
    try {
        //shopId, name , phone, role, baseSalary, salaryType
        const { shopId, name, phone, role, baseSalary, salaryType, idProof } = req.body;

        if (!shopId) {
            return res.status(404).json({ success: false, message: "Enter Valid ShopId" })
        }

        //Extract the Shop
        const shop = await Shop.findById(shopId).populate("salespersons");
        console.log("Shops : ", shop)
        if (!shop) {
            return res.status(404).json({ success: false, message: "Shop Not Found" })
        }

        const salesPersons = shop.salespersons;
        for (const person of salesPersons) {
            if (name === person.name && phone === person.phone) {
                return res.status(404).json({ success: false, message: "Labor Already Exists" })
            }
        }

        const newLabor = {
            shopId,
            name,
            phone,
            role,
            baseSalary,
            salaryType,
            idProof
        }

        // const labor = await Labor.create(newLabor)
        console.log(labor)

        //  Save the labor Id in the Shop (FIXED)
        const updatedShop = await Shop.findByIdAndUpdate(
            shopId, // findByIdAndUpdate automatically looks by _id
            { $push: { salespersons: labor._id } }, // $push adds to the array without overwriting
            { new: true } // Returns the updated document instead of the old one
        );
        console.log("Updated Shop:", updatedShop);

        res.status(200).json({ success: true, message: "Labor Created", updatedShop });
    } catch (error) {
        console.log("Delete Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getLabors = async (req, res) => {
    try {
        const { shopId } = req.params;
        console.log("ShopId ", shopId)

        if (!shopId) {
            return res.status(404).json({ success: true, message: "Enter the Valid Shop Id" })
        }

        const labors = await Labor.find({ shopId })
        console.log("Labors : ", labors);
        if (!labors) {
            return res.status(404).json({ success: false, message: "Labors Not Found" })
        }

        res.status(200).json({ success: true, message: "Labor Listings", labors });
    } catch (error) {
        console.log("Delete Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateLabor = async (req, res) => {
    try {
        const { shopId, laborId } = req.params;
        const { name, phone, idProof, role, baseSalary, salaryType, isActive } = req.body;

        if (!shopId || !laborId) {
            return res.status(400).json({ success: false, message: "Enter Valid Ids" });
        }

        // We bundle only the fields we want to update.
        // If a value is undefined (frontend didn't send it), Mongoose safely ignores it!
        const updateData = {
            name, phone, idProof, role, baseSalary, salaryType, isActive
        };

        // THE TRICK: Find and Update in one go
        const updatedLabor = await Labor.findByIdAndUpdate(
            laborId, 
            updateData, 
            { new: true, runValidators: true } // 'new' returns the updated doc, 'runValidators' ensures your Schema rules apply
        );

        if (!updatedLabor) {
            return res.status(404).json({ success: false, message: "Labor not found" });
        }

        res.status(200).json({ success: true, message: "Labor Data Updated", data: updatedLabor });

    } catch (error) {
        console.log("Update Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const disableLabor = async(req,res)=>{
    try {
        const {shopId , laborId} = req.params;
        if (!shopId || !laborId) {
            return res.status(400).json({ success: false, message: "Enter Valid Ids" });
        }

        const laborDisable = await Labor.findByIdAndUpdate(
            laborId,
            {isActive : false},
            {new : true}
        )

        res.status(200).json({success : true , message : "Disabled the Labor" , laborDisable})

    } catch (error) {
        console.log("Update Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
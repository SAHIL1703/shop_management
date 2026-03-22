import express from "express";
import { createProduct, deleteProduct, getAllProduct, getProduct, updateProduct } from "../controller/productController.js";
import { protect } from "../middleware/Authorization/protect.js";
import { validateProduct } from "../middleware/Joi/validateProduct.js";

const productRouter = express.Router();

//GET all Products 
productRouter.get("/:shopId" , protect , getAllProduct)

// POST is for creating
productRouter.post("/create-product", protect, validateProduct, createProduct);

// GET is for reading
productRouter.get("/:shopId/:productId", protect, getProduct);

// PATCH is for updating (Removed "/update")
productRouter.patch("/:shopId/:productId", protect, updateProduct);

// DELETE is for deleting (Removed "/delete")
productRouter.delete("/:shopId/:productId", protect, deleteProduct);

export default productRouter;
import jwt from "jsonwebtoken"

export const protect = async(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;

        //Check if the authHeaders is present and starts with the Bearer
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false, 
                message: "Access denied. No token provided."
            })
        }

        //Extract the Token list
        const token = authHeader.split(" ")[1];

        //Verify the token
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        //Set the id and role in the req.user
        req.user = decoded;

        next()
    } catch (error) {
        console.log(error.message);
        // You MUST return a response here, otherwise Postman will hang forever!
        return res.status(403).json({ 
            success: false, 
            message: "Invalid or expired token." 
        });
    }
}
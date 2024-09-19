import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;   

    try {
        const user = await User.findOne({ username }).select('-password'); //We can get the user profile which comes from req.params
        if(!user) return res.status(404).json({ error: "User not found"});            
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in getUserProfile : ", error.message);
    }
};

export const followUnfollowUser = async (req, res) => {
      

    try {
        const { id } = req.params; // It should be id because we called it id on "router.post("/follow/:id", protectRoute, followUnfollowUser)" in user.routes.js

        const userToModify = await User.findById(id); //The user we can follow or unfollow      
        const currentUser = await User.findById(req.user._id);
        
        if(id === req.User._id) {
            return res.status(404).json({ message: "You can't follow/unfollow yourself"});
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in followUnfollowUser : ", error.message);
    }
};
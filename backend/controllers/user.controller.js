import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

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
        
        if(id === req.user._id.toString()) {
            return res.status(404).json({ error: "You can't follow/unfollow yourself"});
        }

        if(!userToModify || !currentUser) return res.status(404).json({ error: "User not found"}); //If there's no user
        
        const isFollowing = currentUser.following.includes(id); // currentUser(me) following array includes user id(const { id } = req.params;) 
        
        if(isFollowing) {
            //Unfollow the user
            await User.findByIdAndUpdate(id, { $pull: {followers: req.user._id}}); //pull from the followers array. Because we unfollow them.
            await User.findByIdAndUpdate(req.user._id, { $pull: {following: id}}); //pull from the following array of the current user.
            //TODO: return the id of the user as a response
            res.status(200).json({ error: "User unfollowed successfully"});
        }else {
            //follow the user
            await User.findByIdAndUpdate(id, { $push: {followers: req.user._id}}); //User that we would like to follow. we update the followers array. we push id of the currentUser
            await User.findByIdAndUpdate(req.user._id, { $push: {following: id}}); //we add in the following array the id of the user that we followed.
            //Send notification to the user
            //Model imported from notification.model.js
            const newNotification = new Notification({ 
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });

            await newNotification.save(); //We save in our database

            //TODO: return the id of the user as a response
            res.status(200).json({ error: "User followed successfully"});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in followUnfollowUser : ", error.message);
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select('following');
        
    } catch ( ) {
        
    }
};
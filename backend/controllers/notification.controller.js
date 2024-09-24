import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {

    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ to:userId }) //We have a field called to in Notification. If it match with the user id, get all the notifications for this user.
        .populate({
            path: 'from',
            select: "username profileImg", //when we fetch the notification we would like to show the username and profile image which comes from "from" field in the DB. If we don't pass --path: 'from'-- we just gonna get the id of the user.
        });

        await Notification.updateMany({ to:userId }, {read:true}); //We read this notification so we need to update the notification. read by default is false, so we change the value as true which meand we read the notification.

        res.status(200).json(notifications);

    } catch (error) {
        console.log("Error in getNotifications function: ", error.message);
        res.status(500).json({error: "Internal server error"});        
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to:userId});

        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications function: ", error.message);
        res.status(500).json({error: "Internal server error"}); 
    }
};

/*export const deleteOneNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;
        const notification = await Notification.findById(notificationId);

        if(!notification) res.status(404).json({error: "Notification not found"});

        if(notification.to.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not allowed to delete rhis notification"}) //403 status is unauthorized
        }

        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({ message: "Notification deleted successfully" });
        
    } catch (error) {
        console.log("Error in deleteOneNotification function: ", error.message);
        res.status(500).json({error: "Internal server error"}); 
    }
};*/
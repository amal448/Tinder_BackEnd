const express = require("express")
const router = express.Router()
const { userAuth } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

router.post('/request/send/:status/:toUserId', userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user._id
            const { toUserId, status } = req.params;
            console.log("fromUserId", fromUserId);
            console.log("toUserId", toUserId);

            const allowedStatus = ["interested", "ignored"]
            if (!allowedStatus.includes(status)) throw new Error("status can't be updated " + status);
            const checktoUserId = await User.findById(toUserId)
            if (!checktoUserId) throw new Error("User not exist");
            const check = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
            })

            if (!check) {
                const connectionRequest = new ConnectionRequest({
                    fromUserId,
                    toUserId,
                    status
                })
                await connectionRequest.save()
                res.status(200).json({
                    message: req.user.firstName + ' '
                    + status + " " +
                    checktoUserId.firstName
                })
            }
            else {
                throw new Error("Connection already Exist")
            }
        }
        catch (error) {
            res.status(400).send(error.message)
        }
    })
module.exports = router
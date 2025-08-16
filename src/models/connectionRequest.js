const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`
            }
        }
    },
    { timestamps: true }
)

//compound index use cases
// ex: userSchema.index({firstName:1,lastName:1})


// ConnectionRequest.find(fromUserId:65232333223823283) used for optimisization
// of app as this excetuse in short span even though large request are there

connectionRequestSchema.index({fromUserId:1,toUserId:1}) //1 ascenting -1 descenting
//will pre check whether the reuest is going to same id


connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself")
    }
    next();
})

const connectionRequestModel =
    new mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = connectionRequestModel
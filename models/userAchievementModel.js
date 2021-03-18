const mongoose = require('mongoose')

const UserAchievement = mongoose.model('UserAchievement', {
    
    user_id: {type: String },
    group_id: {type: String },
    achievement_id:  { type: String },
    updated_at: {type: Date, default: new Date()},
    
    __v: { type: Number, select: false },
    // _id: { type: Number, insert:true, select: false }
})

module.exports = UserAchievement
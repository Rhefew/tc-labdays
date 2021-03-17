const mongoose = require('mongoose')

const Achievement = mongoose.model('Achievement', {

    achievement_id:  {type: String, unique: true },
    name: { type: String, default: "", unique: true },
    description: { type: String },
    points: { type : Number, default: 0 },    
    __v: { type: Number, select: false },
    // _id: { type: Number, insert:true, select: false }
})

module.exports = Achievement
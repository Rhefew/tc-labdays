const axios = require('axios').default;

const catchAsync = require('../utils/catchAsync')

const Achievement = require('../models/achievementModel')


exports.getAchievements =  catchAsync(async (req, res) => {

    const achievements = await Achievement.find().exec();
        
    if(achievements){
        return res.status(200).json({
            result: achievements
        });
    }else{
        return res.status(400).json({
            status: 'error'
        });
    }

})

exports.createAchievement =  catchAsync(async (req, res) => {
    
    const body = req.body
    console.log(body)

    const storedAchievement = await Achievement.findOne( { achievement_id: body.achievement_id } )
        if(!storedAchievement){
        const achievement = await Achievement.create(body)
            
        if(achievement){
            return res.status(200).json({
                result: achievement
            });
        }else{
            return res.status(400).json({
                status: 'error'
            });
        }
    }

    return res.status(200).json({
        result: storedAchievement
    });

})


async function createAchievement(data){
    const foundMatch = await Achievement.findOne({ achievement_id: data.achievement_id }).exec();
    if (!foundMatch) {
        return await Achievement.create(match);
    }
    return foundMatch
}
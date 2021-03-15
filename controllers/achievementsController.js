const axios = require('axios').default;

const catchAsync = require('../utils/catchAsync')

const Achievement = require('../models/achievementModel')
const UserAchievement = require('../models/userAchievementModel')


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
            return res.status(201).json({
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

exports.getUserAchievements = catchAsync(async (req, res) => {
    console.log(req.params)

    const { userId } = req.params
    const achievements = await UserAchievement.find( {user_id: userId} ).exec();

    return res.status(200).json({
        result: achievements
    })
})

exports.createUserAchievement =  catchAsync(async (req, res) => {
    
    const { userId } = req.params
    const { group_id, achievement_id } = req.body
    const body = { group_id: group_id, user_id: userId, achievement_id: achievement_id }

    console.log(body)
    const storedAchievement = await UserAchievement.findOne(body).exec()
    
    if(!storedAchievement){
        const achievement = await UserAchievement.create(body)
            
        if(achievement){
            return res.status(201).json({
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
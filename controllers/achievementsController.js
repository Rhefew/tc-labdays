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

exports.getUserAchievementsForGroup = catchAsync(async (req, res) => {

    const { userId } = req.params
    const { group_id } = req.query
    const userAchievements = await UserAchievement.find( {user_id: userId, group_id: group_id} ).exec();

    if(userAchievements){
        let result = Object.values(userAchievements.reduce((a,{user_id, achievement_id, updated_at}) => {
            let key = `${user_id}_${achievement_id}`;
            a[key] = a[key] || {user_id, achievement_id, level : 0, updated_at};
            a[key].level++;
            return a;
          }, {}));

          const allAchievements = await Achievement.find()
          
          result.forEach( (a) => {
              const pointsOfAchievement = allAchievements.find( (ach) => a.achievement_id === ach.achievement_id)
              if(pointsOfAchievement)
                a.points = calcPoints(pointsOfAchievement.points, a.level)
          })

          
        return res.status(200).json({
            result
        })
    }
})

exports.getGroupLeaderboard = catchAsync(async (req, res) => {

    const { groupId } = req.params
    const allAchievements = await Achievement.find()
    const achievements = await UserAchievement.find( {group_id: groupId} ).exec();

    if(achievements){
        let result = Object.values(achievements.reduce((a,{user_id, achievement_id}) => {
            let key = `${user_id}_${achievement_id}`;
            a[key] = a[key] || {user_id, achievement_id, level : 0};
            a[key].level++;
            return a;
        }, {}));

        let currentUserId = null
        
        const newAchievementGrouped = []
        result.forEach( (element ) => {
            if(element.user_id !== currentUserId){
                currentUserId = element.user_id
                
                const achievementsForUser = result.filter( (achievement) => achievement.user_id === currentUserId)
                const groupedAchievements = []
                let totalPoints = 0
                achievementsForUser.forEach( (a) => {
                    const pointsOfAchievement = allAchievements.find( (ach) => a.achievement_id === ach.achievement_id)
                    if(!pointsOfAchievement) return


                    totalPoints+= calcPoints(pointsOfAchievement.points, a.level)
                    groupedAchievements.push( { achievement_id: a.achievement_id, level: a.level, points: calcPoints(pointsOfAchievement.points, a.level), updated_at: pointsOfAchievement.updated_at } )
                })

                newAchievementGrouped.push( {user_id: currentUserId, total_points: totalPoints, achievements: groupedAchievements } )
    
            }
        })
        
        return res.status(200).json({
            result: newAchievementGrouped.sort(sortBy("-total_points"))
        })
    }
})

exports.createUserAchievement =  catchAsync(async (req, res) => {
    
    const { userId } = req.params
    const { group_id, achievement_id } = req.body
    const body = { group_id: group_id, user_id: userId, achievement_id: achievement_id }

    const achievement = await UserAchievement.create(body)
    
    const achievements = await UserAchievement.find( {group_id: group_id, user_id: userId, achievement_id: achievement.achievement_id} ).exec();

    if(achievements){
        let result = Object.values(achievements.reduce((a,{user_id, achievement_id}) => {
            let key = `${user_id}_${achievement_id}`;
            a[key] = a[key] || {user_id, achievement_id, level : 0};
            a[key].level++;
            return a;
        }, {}));


        return res.status(200).json({
            result: result[0]
        })
    }
    if(achievement){
        return res.status(201).json({
            result: {user_id: achievement.user_id, group_id: achievement.group_id, achievement_id: achievement.achievement_id}
        });
    }else{
        return res.status(400).json({
            status: 'error'
        });
    }
})

  function sortBy(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }

    
}

function calcPoints(base, level){
    let basePoints = base
    let totalPoints=0
    
    for(i=1; i<= level; i++){
        totalPoints+=basePoints
        if(basePoints>1)
            basePoints--
    }

    return totalPoints
}
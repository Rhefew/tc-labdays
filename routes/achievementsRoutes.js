const express = require('express')
const archievementsController = require('../controllers/achievementsController')

const router = express.Router()

router
.route('/achievements')
.get(archievementsController.getAchievements)
.post(archievementsController.createAchievement)

// router
// .route('/user/achievements')
// .get(archievementsController.getUserAchievements)
// .post(archievementsController.createUserAchievement)

// router
// .route('/leaderboard/:groupId')
// .get(archievementsController.getLeaderboard)



module.exports = router
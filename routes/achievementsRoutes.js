const express = require('express')
const archievementsController = require('../controllers/achievementsController')

const router = express.Router()

router
.route('/achievements')
.get(archievementsController.getAchievements)
.post(archievementsController.createAchievement)

router
.route('/users/:userId/achievements')
.get(archievementsController.getUserAchievements)
.post(archievementsController.createUserAchievement)

// router
// .route('/groups/:groupId/achievements')
// .get(archievementsController.getGroupAchievements)

// router
// .route('/leaderboard/:groupId')
// .get(archievementsController.getLeaderboard)



module.exports = router
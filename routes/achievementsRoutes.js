const express = require('express')
const archievementsController = require('../controllers/achievementsController')

const router = express.Router()

router
.route('/achievements')
.get(archievementsController.getAchievements)
.post(archievementsController.createAchievement)

router
.route('/users/:userId/achievements')
.get(archievementsController.getUserAchievementsForGroup)
.post(archievementsController.createUserAchievement)

router
.route('/groups/:groupId/leaderboard')
.get(archievementsController.getGroupLeaderboard)


module.exports = router
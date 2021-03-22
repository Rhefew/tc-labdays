const express = require('express')
const achievementsRoutes = require('./routes/achievementsRoutes')
const mongoose = require('mongoose')

const app = express()


const mongoDB = "mongodb://localhost:27017/matches?readPreference=primary&appname=MongoDB%20Compass&ssl=false&retryWrites=true&w=majority"
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {
    const hasErrors = error? 'false' : 'true'
    console.log('connected to db: ' + hasErrors)
})

// Routes
app.use(express.json());

app.use('/api/v1', achievementsRoutes);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server started on port ${port}`))

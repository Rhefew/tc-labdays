const request = require('request');
const axios = require('axios').default;

const catchAsync = require('../utils/catchAsync')

const Match = require('../models/matchModel')

const BASE_URL = "http://api.steampowered.com/IDOTA2Match_570"
// const API_KEY = "D74D3F46EC5EDD05BCE4FAFC2DF9486D"
const API_KEY = "9F7092E09340A6008E99EB1DCBD6BBA3"

exports.getDotaMatchHistory =  catchAsync(async (req, res) => {

        const key = req.query.key ? req.query.key : API_KEY;
        const { game_mode, min_players, account_id, start_at_match_id, hero_id } = req.query;

        const request = await axios.get(`${BASE_URL}/GetMatchHistory/v1`,{
            params: {
                format: "json",
                key,
                game_mode,
                min_players,
                account_id,
                start_at_match_id,
                hero_id
            }
        })

        if (request.status == 200){
             return res.status(200).json({
                result: request.data
            })   
        }
    
        return res.status(400).json({
            status: 'error'
        });
    })


exports.getDotaMatchHistoryDetails =  catchAsync(async (req, res) => {
    const key = req.query.key? req.query.key : API_KEY
    const { id } = req.params

    const request = await axios.get(`${BASE_URL}/GetMatchDetails/v1`,{
        params: {
            format: "json",
            key,
            match_id: id
        }
    })

    if (request.status == 200){
        const match = request.data.result
        console.log("🚀 ~ file: matchesController.js ~ line 54 ~ exports.getDotaMatchHistoryDetails=catchAsync ~ match", match)
        const foundMatch = await Match.findOne({ match_id: match.match_id }).exec();
        if (foundMatch) {
            return res.status(200).json({
                cached: true,
                result: foundMatch
            });
        }

        const createdMatch = await Match.create(match);
        return res.status(200).json({
            cached: false,
            result: createdMatch
        });
    }

    return res.status(400).json({
        status: 'error'
    });
})

exports.get100MatchesAndInsertIntoDB = catchAsync(async (req, res) => {
   
    
    const key = req.query.key ? req.query.key : API_KEY;
    const { game_mode, min_players, account_id, hero_id, start_at_match_id } = req.query;

    
    const lastMatch = await Match.findOne({ hero_id: hero_id, account_id: account_id}).sort({ _id: -1 }).exec()
    console.log(lastMatch)

    const request = await axios.get(`${BASE_URL}/GetMatchHistory/v1`,{
        params: {
            format: "json",
            key,
            account_id,
            ...(lastMatch) && { start_at_match_id: lastMatch.match_id },
            hero_id
        }
    })

    const matches = request.data.result.matches
    
    matches.map( async (match) => {

        const foundMatch = await Match.findOne({ match_id: match.match_id }).exec();
        if (!foundMatch) {
            // console.log("==============NEW MATCH==============")
            const request = await axios.get(`${BASE_URL}/GetMatchDetails/v1`,{
                params: {
                    format: "json",
                    key,
                    match_id: match.match_id
                }
            }).catch( (e) => {
                console.log("==============BANNED==============")
            })
            if(request){
                insertMatch(request.data.result)
            }
        }else{
            if(foundMatch.players.some( (player) => player.account_id === 112010088)){
                console.log("==============MATCH WITH RHEFEW FOUND!==================")
            }
        }
    })
    return res.status(200).json(
        { 
            insertedMatches: matches.length
        })

})

async function insertMatch(match){
    const foundMatch = await Match.findOne({ match_id: match.match_id }).exec();
    if (!foundMatch) {

        const createdMatch = await Match.create(match);
        // console.log("🚀 ~ file: matchesController.js ~ line 140 ~ insertMatch ~ createdMatch", "Match " + createdMatch.match_id + " created")
        
        return createdMatch
    }
}
var express = require('express');
var router = express.Router();
const { userSchema } = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const querystring = require('querystring');
const { default: axios } = require('axios');
const auth = require('../middleware/auth');
const { token } = require('../model/tokenSpotify');


const generateToken = (size) => {
  return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      .repeat(60)
      .split("")
      .sort(() => Math.random() - 0.5)
      .slice(0, size)
      .join("")
}

router.post('/create-account', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const find = await userSchema.findOne({ where: { pseudo: req.body.pseudo } })
  if (find) {
    res.status(203).send('Pseudo deja utilisé')
  } else {
    let newUser = {
      pseudo: req.body.pseudo,
      password: await bcrypt.hash(req.body.password, salt)
    }
    created_user = await userSchema.create(newUser)
    res.status(201).json(newUser)
  }
})

const scope = 'playlist-read-private user-top-read streaming user-read-recently-played user-read-private user-library-read user-follow-read playlist-read-collaborative '

router.post('/login', async (req, res, next) => {
  const user = await userSchema.findOne({ where: { pseudo: req.body.pseudo } });
  if (user) {
    const password_valid = await bcrypt.compare(req.body.password, user.password);
    if (password_valid) {
      const token = jwt.sign({ "id": user.userId, "pseudo": user.pseudo }, process.env.SECRET, { expiresIn: '1h' });
      res.status(201).send({token: token})
    } else {
      res.status(400).json({ error: "Password Incorrect" });
    }
  } else {
    res.status(404).json({ error: "User does not exist" });
  }
});

const tab = []
router.post('/sync',auth, async (req, res) => {
  const state = generateToken(10)
  const userId = req.userId
    if(req.userPseudo){
      const a = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: process.env.CLIENT_ID,
          scope: scope,
          redirect_uri: process.env.REDIRECT,
          state: state
        })
        tab.push({"user_id":userId,"state":state})
        console.log(state)
      res.send(a)
  } else {
    res.status(404).json({ error: "User does not exist" });
  }
});

router.get('/logged',async (req, res) => {
  const State = req.query.state
  const resp = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: process.env.REDIRECT,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
      "Accept-Encoding": "null"
    },
  })
  .then(async (res) =>{
    const userID = tab.find(({state}) => state === State).user_id
    const access_token = res.data.access_token
    const refresh_token =res.data.refresh_token
    console.log(res.data)
    const a = {
      userId:userID,
      accessToken: access_token,
      refreshToken:refresh_token,
    }
    console.log(a)
    await token.create(a).catch(e => console.log(e))
    res.status(201).send()}) 
  .catch(() => null)
})

const getTracks = async(userId) =>{
  let str = ""
  const tokenspotify = await token.findOne({where: {userId: userId}})
  const access_token = tokenspotify.accessToken
  const resp = await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: {
      'content-type': 'Content-Type: application/json',
      "Authorization": `Bearer ${access_token}`,
      "Accept-Encoding": "null"
    },
  }).catch((e) => console.log(e))
  const ids= resp.data.items.map(item => item.track.id).join(",")
  return ids
  
}

router.get("/getUser", async (req, res) => {
  const displayUsers = await userSchema.findAll()
  console.log(displayUsers)
  console.log(typeof(displayUsers))
  res.status(201).send(displayUsers)

})

router.get("/spotifyToken",async (req,res) =>{
  const toto = token.findAll().then(res => {
    console.log(res)
  }).catch((error) => {
    console.error('Failed to retrieve data : ', error);
  });
  res.status(201).send({ data: toto })

})

router.get("/personality",auth,async(req,res) =>{
  const userId = req.userId
  const ids = await getTracks(userId)
  const tokenspotify = await token.findOne({where: {userId: userId}})
  const access_token = tokenspotify.accessToken
  console.log('https://api.spotify.com/v1/audio-features?ids=' + ids)
  const resp = await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/audio-features?ids=' + ids,
    headers: {
      'content-type': 'Content-Type: application/json',
      "Authorization": `Bearer ${access_token}`,
      "Accept-Encoding": "null"
    },
  }).catch((e) => res.send(e))
  let countDanceability = 0
  let countTempo = 0
  let countValence = 0
  let countPreference = 0
  let counterD = 0
  let counterT = 0
  let counterV = 0
  let counterP = 0


  await resp.data.audio_features.map((track) =>{
    countDanceability +=track.danceability
    counterD++
  })
  const danceability = countDanceability/counterD
  await resp.data.audio_features.map((track) =>{
    countTempo +=track.tempo
    counterT++
  })
  const tempo = countTempo/counterT

  await resp.data.audio_features.map((track) =>{
    countPreference +=track.instrumentalness
    counterP++
  })
  const preference = countPreference/counterP
  await resp.data.audio_features.map((track) =>{
    countValence +=track.valence
    counterV++
  })
  const valence = countValence/counterV
  
  const result = {
    attraitPourLaDance: danceability,
    agitation: tempo,
    preference: preference,
    valence: valence

  }
  res.send(result)
})

router.get('/callback', (req,res) =>{
  res.send('redirect réussi')
})
module.exports = router;

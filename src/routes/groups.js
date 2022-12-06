var express = require('express');
var router = express.Router();
const {groupSchema} = require('../model/group')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { userSchema } = require('../model/user');


router.get("/getGroups", (req,res) =>{
    const displayGroups =groupSchema.findAll().then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });
    res.status(201).send({data:displayGroups})
  
  })

router.get("/:group",auth,async (req,res) =>{
    const userId = req.userId
    const group = await groupSchema.findOne({where: {name: req.params.group}})
    console.log(group)
    if (!group) {
        let newGroup = {
            name: req.params.group,
            chefId: userId,
            nbrUser: 1
          }
          const group = await groupSchema.create(newGroup)
          const groupId = group.groupId
          const user = await userSchema.findOne({where: {userId: userId}})
          await user.update({groupId: groupId})
          res.status(201).send()
    }else{
        const user = await userSchema.findOne({where: {userId: userId}})
        const oldgrpId = user.groupId
        if (oldgrpId){
            const oldgrp = await groupSchema.findOne({where:{groupId:oldgrpId}})
            const nbrUser = oldgrp.nbrUser
            const random = Math.floor(Math.random() * nbrUser)
            await oldgrp.update({nbrUser: oldgrp.nbrUser-1})
            if (nbrUser === 1){oldgrp.destroy()}
            if(oldgrp.chefId === user.userId){
                const allUsersGroup = await userSchema.findAll({where: {groupId: oldgrp.groupId}})
                const newChef = allUsersGroup[random].userId
                oldgrp.update({chefId:newChef})
                res.status(201).send()
            }else {
                await oldgrp.update({nbrUser: oldgrp.nbrUser-1})
                res.status(201).send()
            }
        }else{
        await user.update({groupId: group.groupId})
        group.update({nbrUser: group.nbrUser+1})
        res.status(201).send()
    }}
})

router.get('/getGroup/:group',async (req,res)  =>{
    const groupe = await groupSchema.findOne({where: {name: req.params.group}})
    if (groupe) res.status(200).send({name:groupe.name,nbrUser: groupe.nbrUser})
    else res.status(401).send('Groupe introuvable')
})

router.get('/getGroups/users/:params',auth,async (req,res) =>{
    const userId = req.userId
    const user = await userSchema.findOne({where: {userId}})
    const groupe = await groupSchema.findOne({where: {groupId: user.groupId}})
    if (groupe){
        const allUsers = await userSchema.findAll({where: {groupId: groupe.groupId}})
        const allUsersTab = []
        const chef = groupe.chefId
        allUsers.map((users) => {
            let role = 'membre du groupe'
            if (chef === userId) role = 'chef'
            let user = {
                pseudo: users.pseudo,
                role: role
            }
            allUsersTab.push(user)
        })
        res.status(201).send(allUsersTab)
    }
    else res.status(401).send('Cet utilisateur n a pas de groupe ')
})
module.exports = router;
const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const user = require('./model/user')
const tenant = require('./model/tenant')
const bcrypt = require('bcryptjs')
const ObjectId = require('mongoose').Types.ObjectId; 

mongoose.connect(process.env.URI, function(err, db){
    if(!err){
        console.log("DB Connected Successfully!")
    }
    else{
        console.log(err)
    }
})

app.use(bodyParser.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send("Hatdog ka")
})

app.post('/register', async (req, res) => {
    const { email, password, firstName, lastName} = req.body

    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const emailResult = emailRegexp.test(email)
    
    if(!emailResult){
        return res.status(400).send( {'status': 'error', 'message': 'Invalid e-mail'})
    }

    pword = await bcrypt.hash(password, 10)

    /* const existingUser = user.findOne({ email });
    if (existingUser) return res.json({ status: 'user already exists'}) */

    try {
        const response = await user.create({
            email: email,
            password: pword,
            firstName: firstName,
            lastName: lastName
        })

        console.log("User created successfully: " + response)
        return res.status(200).send( { 'status': 'success'})
    } catch (error) {
        return res.status(400).send({ 'status': 'error', 'message': 'Duplicate User'})
    }
})

app.post('/addTenant', async (req, res) => {
    const { firstName, lastName, landlordEmail, gender, status, unitDetails } = req.body
    console.log(req.body)

    try {
        const response = await tenant.create({
            firstName,
            lastName,
            unitDetails,
            gender,
            status,
            landlordEmail
        })
        console.log("Tenant created successfully: " + response)
        res.status(200).send( { 'status': 'success', 'message': 'Tenant Created successfully!'})
    } catch (error) {
        console.log(error)
        res.status(400).send({ 'status': 'error', 'message': 'Duplicate User'})
    }
})

app.post('/getTenant', async (req, res) => {
    const landlordEmail = req.body
    const data = await tenant.find(landlordEmail)
    console.log(data)
    res.send(data)
})

app.post('/tenant', async (req, res) => {
    let id = req.body
    id = new ObjectId(id)


    try {
        var result = await tenant.find({'_id': id})
    } catch (error) {
        console.log(error)
        res.status(400).send({'status': 'error', 'message': error})
    }

    if(result){
        res.status(200).send(result)
    }
    else{
        res.status(400).send({'status': 'error', 'message': 'Tenant not found'})
    }

    
})

app.post('/update', async (req, res) => {
    let {id, status} = req.body
    id = new ObjectId(id)


    try {
        var result = await tenant.findOneAndUpdate({'_id': id}, {status})
    } catch (error) {
        console.log(error)
        res.status(400).send({'status': 'error', 'message': error})
    }

    if(result){
        res.status(200).send(result)
    }
    else{
        res.status(400).send({'status': 'error', 'message': 'Tenant not found'})
    }

    
})

app.get('/register', async (req, res) => {
    await client.connect()

    console.log('Connected Successfully sa DB!')
    res.send("XD")
})

app.post('/login', async(req, res) =>{
    const { email, password} = req.body

    pword = await bcrypt.hash(password, 10)
    let resul = ''
    try{
        resul = await user.findOne({
        'email': email
    })
    } 
    catch (err){
        console.log(err)
        res.status(400).send({'status': 'error', 'message': 'User does not exist!'})
    }
    
    console.log(resul)
    /* if(!resul){
        res.sendStatus(200) 
    }
    else{
        res.status(400).send({'status': 'error', 'message': 'No user found'})
    }  */
    if(resul){

        bcrypt.compare(password, resul['password'], (err,data) => {
            if(err) throw err

            if (data) {
                res.status(200).send({'status': 'success', 'message': "Login Success" })
            } else {
                res.status(401).send({'status': 'error', 'message': "Wrong password" })
            }
        })    
    }
    else{
        res.status(400).send({'status': 'error', 'message': 'No user found'})
    }
    

})

app.listen(process.env.PORT, () => {
    console.log("Connected Successfully!")
})
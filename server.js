const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = !process.env.PORT ? 4221 : process.env.PORT
const publicEndpoint = '/public'
const styles = 'public'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
let secret = process.env.NOTHING
const parseStr = (str) => {
    return str.toLowerCase();
} 
// connect mongoose
// const uri = "mongodb+srv://regUser99:v37p2q1dWVtfpr4Q@testcluster99.5ho28ns.mongodb.net/?retryWrites=true&w=majority&appName=testCluster99"
mongoose.connect(process.env.URI)
// user schema
const userSchema = new Schema({
    name:{type:String},
    email:{type:String,required:true}
})
 const User = mongoose.model('User',userSchema)
// todo schema
const todoSchema = new Schema({
    email:{type:String,required:true},
    todo:{type:String}
})
 const Todo = mongoose.model('Todo',todoSchema)
// starter static-files
app.use(cors());
app.use(publicEndpoint,express.static(styles))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
let filter_id;




// post the body from filter.js
app.post("/server/filter/choice",(req,res)=>{
    let id = req.body.number;
    switch(true){
        case id==1:
        filter_id = id;
        break;
        case id==2:
        filter_id = id;
        break;
        case id==3:
        filter_id = id;
        break;
        default:
        console.log(undefined)
    }

})
// get homepage
app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/views/index.html')
})
// change user email
app.get("/change-email", async (req,res)=>{
let any = await User.find({})
console.log(any)
console.log(any.length)

if(any.length > 0){
    res.sendFile(__dirname+'/views/changeEmail.html')
}
else{
    res.sendFile(__dirname+ "/views/noUsersFound.html")
}
})
// post changed email
app.post("/form/users/email/change", async (req,res)=>{
    let {newemail,currentemail,id} = req.body
    let filter = id
    const findOne = id ? await User.findById(filter) : ''
    console.log(req.body)
    // console.log(findOne)
    try{
        if(currentemail.length > 0){
            if(findOne&&currentemail===findOne.email){
                const updateEmail = await User.findOneAndUpdate({email:currentemail},{email:newemail},{new:true})
                res.sendFile(__dirname + '/views/emailChangeConfirm.html')
                return;
            }
            else{
                res.sendFile(__dirname + '/views/permission.html')
            }
        }
        else{
            res.sendFile(__dirname + '/views/permission.html')
        }
    }
   
    catch(err){
        console.log(err)
    }
})
// change user name 
app.get("/change-name", async (req,res)=>{
    let any = await User.find({})
console.log(any)
console.log(any.length)

if(any.length > 0){
    res.sendFile(__dirname+'/views/changeName.html')
}
else{
    res.sendFile(__dirname+ "/views/noUsersFound.html")
}
})
// post changed name
app.post("/form/users/name/change", async (req,res)=>{
    let {newname,currentname,id} = req.body
    let filter = id
    const findOne = id ? await User.findById(filter) : ''
    console.log(findOne)
    // console.log(req.body)
    try{
    if(findOne&&currentname === findOne.name&&currentname.length!==0){
        const updateName = await User.findOneAndUpdate({name:currentname},{name:newname},{new:true})
        res.sendFile(__dirname + '/views/nameChangeConfirm.html')
        return;
    }
    else{
        res.sendFile(__dirname + '/views/permission.html')
    }
    }
    catch(err){
        console.log(err)
    }
})
// For Educational purposes, you can store your endpoint into an env variable. 
// For example, I am hiding user's IDs for my own viewing.
// 
app.get('/api/secret', async (req,res)=>{
    let users = await User.find({}).select({"__v":0}) // find all users, and hide the version number to clean up.
    let mappedUsers = [...users].map(u=>u)
    return !users ? res.send("No users are in the db collection") : res.json({users:mappedUsers})
})
//GET the users with the given email address
app.get('/api/:email/stored', async (req,res)=>{
    const email=req.params.email
    const u = await User.findOne({email:email})
    const t = await Todo.findOne({email:email})

    console.log(u)
    console.log(t)
    res.json({name:u.name,email:u.email,todo:t.todo})
})
// add user to form / retrieve user from form
app.post("/form/users", async(req,res)=>{
    let name = parseStr(req.body.name)
    let email = parseStr(req.body.email)
    let todo = parseStr(req.body.todo)

    const findUser = await User.findOne({email:email});
    const allUsers = await User.find({})
    let count = [...allUsers].filter(a=>/Anonymous/.test(a.name)).length; // retrieve the number of items that have 'Anonymous' for "name" property
    const isEmpty = (input) => {
        return input===undefined||input===''
    }
    try{
        if(isEmpty(email)){
            res.redirect('/') // redirect user back to homepage (same page currently on)
            return;   
        }
        // if user is not foudn in db, create new user
        if(!findUser){
            if(allUsers.length > 50){
                res.sendFile(__dirname + '/views/max.html')
            }
            else{
                const newUser = new User({ 
                    // create new user & email
                    name:name?name:'Anonymous'+count,
                    email
                })
                const sU = await newUser.save() //save user
                console.log(sU)
                // create new todo & email
                const todoObj = new Todo({
                    email: sU.email,
                    todo:todo ? todo : 'N/A'.toLowerCase()
                })
                const sTodo = await todoObj.save();
    
                console.log(sTodo)
                res.sendFile(__dirname+'/views/create.html')
            }
            
        }
        else{
            // if user is found, redirect it to GET user info
            res.redirect(`/api/${findUser.email}/stored`)
        }    
        
        
    }
    catch(err){
        console.log(err)
    }
})
// get list of users
app.get("/users", async(req,res)=>{
    let users = await User.find({}).select({"_id":0}).select({"__v":0}) // find all users, and hide the version number to clean up.
    const todos = await Todo.find({})
    let mappedUsers = [...users].map((u,i)=>({name:u.name,email:u.email,todo:todos[i].todo}))
    return !users ? res.send("No users are in the db collection") : res.json({users:mappedUsers})
})

// get todos => redirect to users (same thing)
app.get("/todo", async(req,res)=>{
    let users = await User.find({}).select({"_id":0}).select({"__v":0}) // find all users, and hide the version number to clean up.
    const todos = await Todo.find({})
    let mappedUsers = [...users].map((u,i)=>({name:u.name,email:u.email,todo:todos[i].todo}))
    return !users ? res.send("No users are in the db collection") : res.json({todo:mappedUsers})
})
// get todos => redirect to users (same thing)
app.get("/email", async(req,res)=>{
    let users = await User.find({}).select({"_id":0}).select({"__v":0}) // find all users, and hide the version number to clean up.
    const todos = await Todo.find({})
    let mappedUsers = [...users].map((u,i)=>({name:u.name,email:u.email,todo:todos[i].todo}))
    return !users ? res.send("No users are in the db collection") : res.json({email:mappedUsers})
})
//drop data with userId & email
app.post('/users/specific/drop',async(req,res)=>{
    const id = req.body.id, email = req.body.currentemail
    const u = id ? await User.findById(id) : ''
    const t = await Todo.findOne({email:u.email})
    console.log(id,u)
    try{
        if(u && u.email==email){
            await User.deleteOne({_id:id})//user found
            await Todo.deleteOne({email:u.email})
            res.sendFile(__dirname+'/views/dropUser.html')
        }
        else{
            res.sendFile(__dirname + '/views/permission.html')
        }
    }
    catch(err){
        console.log(err)
    }
})
// send file to filter
app.get("/filter/todo", async (req,res)=>{
    const allUsers = await User.find({})
    const allTodo = await User.find({})
    const uCount = [...allUsers].length;
    const tCount = [...allTodo].length;
   try{
    if(tCount>0||uCount>0){
        res.sendFile(__dirname+'/views/filter.html')
    }
    else{
        res.sendFile(__dirname+ "/views/noUsersFound.html")
    }
    }
    catch(err){
        console.log(err)
    }
})
// send file to filter
app.get("/filter/users", async (req,res)=>{
    const allUsers = await User.find({})
    const allTodo = await User.find({})
    const uCount = [...allUsers].length;
    const tCount = [...allTodo].length;
   try{
    if(tCount>0||uCount>0){
        res.sendFile(__dirname+'/views/filter2.html')
    }
    else{
        res.sendFile(__dirname+ "/views/noUsersFound.html")
    }
    }
    catch(err){
        console.log(err)
    }
})
// post list of users by similar todo
app.post("/todo/:todo/", async (req,res)=>{

    let todoodie,todoodie1,todoodie2,todoodie3;
    console.log(filter_id)
    console.log('POSTED')
    if(filter_id==undefined){
    // contains regex
     todoodie = req.body.todo
     todoodie1 = todoodie+' '
     todoodie2 = ' '+todoodie
     todoodie3 = ' '+todoodie+' '
    }
    if(filter_id==1){
    // contains regex
     todoodie = req.body.todo
     todoodie1 = todoodie+' '
     todoodie2 = ' '+todoodie
     todoodie3 = ' '+todoodie+' '
    }
    
    if(filter_id==2){
    // start-with regex
     todoodie = '^' + req.body.todo
     todoodie1 = '^' + todoodie + ' '
     todoodie2 = '^' + ' '+todoodie
     todoodie3 = '^' + ' '+todoodie + ' '

    }
   if(filter_id==3){
    // ends-width regex
     todoodie = req.body.todo + '$'
     todoodie1 = todoodie + ' ' + '$'
     todoodie2 = ' ' + todoodie + '$'
     todoodie3 = ' ' + todoodie + ' ' + '$'

   }
   if(filter_id==4){
    // ends-width regex
     todoodie = '\s' + req.body.todo + '\s'
     todoodie1 = '\s' + todoodie + ' ' + '\s'
     todoodie2 = '\s' + ' ' + todoodie + '\s'
     todoodie3 = '\s' + ' ' + todoodie + ' ' + '\s'

   }
   
//    parseStr(todoodie)
console.log(req.body.todo)
    let arr = []
    let filter = []
    const t = await Todo.find({})
    const u = await User.find({})
    let n;
    let i=0;
    let j = 0;
    let argTodo = new RegExp(todoodie)
    let argTodo1 = new RegExp(todoodie1)
    let argTodo2 = new RegExp(todoodie2)
    let argTodo3 = new RegExp(todoodie3)
    // console.log(argTodo)
    
        for( i; i < t.length,j < t.length&&j<t.length; i++ ){
            let user = u[i]
            let todo = t[i]
            let jtodo = t[j].todo
            n={
                name:user.name,
                email:user.email,
                todo:todo.todo
            }
            if(argTodo.test(jtodo)||argTodo1.test(jtodo)||argTodo2.test(jtodo)||argTodo3.test(jtodo)){
                filter.push(n)
                // console.log('pass')
            }
            else{
                // console.log('fail')
            }
            j+=1
    
            // console.log(n)
            arr.push(n)
    
        }  
        return arr.length<1?res.send("No todos or users are entered") : res.redirect(`/todo/${todoodie}`)
    
    
})
// post list of users by similar name
app.post("/users/:user/", async (req,res)=>{
    console.log(filter_id)
    let usertoodie,usertoodie1,usertoodie2,usertoodie3;
    if(filter_id==undefined){
        // contains regex
         usertoodie = req.body.user
         usertoodie1 = usertoodie+' '
         usertoodie2 = ' '+usertoodie
         usertoodie3 = ' '+usertoodie+' '
        }
    if(filter_id==1){
        // contains regex
         usertoodie = req.body.user
         usertoodie1 = usertoodie+' '
         usertoodie2 = ' '+usertoodie
         usertoodie3 = ' '+usertoodie+' '
        }
        
        if(filter_id==2){
        // start-with regex
         usertoodie = '^' + req.body.user
         usertoodie1 = '^' + usertoodie + ' '
         usertoodie2 = '^' + ' '+usertoodie
         usertoodie3 = '^' + ' '+usertoodie + ' '
    
        }
       if(filter_id==3){
        // ends-width regex
         usertoodie = req.body.user + '$'
         usertoodie1 = usertoodie + ' ' + '$'
         usertoodie2 = ' ' + usertoodie + '$'
         usertoodie3 = ' ' + usertoodie + ' ' + '$'
    
       }
       if(filter_id==4){
        // ends-width regex
         usertoodie = '\s' + req.body.user + '\s'
         usertoodie1 = '\s' + usertoodie + ' ' + '\s'
         usertoodie2 = '\s' + ' ' + usertoodie + '\s'
         usertoodie3 = '\s' + ' ' + usertoodie + ' ' + '\s'
    
       }
    let arr = []
    let filter = []
    const t = await Todo.find({})
    const u = await User.find({})
    let n;
    let i=0;
    let j = 0;
    let argUser = new RegExp(usertoodie)
    let argUser1 = new RegExp(usertoodie1)
    let argUser2 = new RegExp(usertoodie2)
    let argUser3 = new RegExp(usertoodie3)
    
        for( i; i < t.length,j < t.length&&j<t.length; i++ ){
            let user = u[i]
            let todo = t[i]
            let juser = t[j].name
            n={
                name:user.name,
                email:user.email,
                todo:todo.todo
            }
            if(argUser.test(juser)||argUser1.test(juser)||argUser2.test(juser)||argUser3.test(juser)){
                filter.push(n)
                // console.log('pass')
            }
            else{
                // console.log('fail')
            }
            j+=1
    
            // console.log(n)
            arr.push(n)
    
        }  
        return arr.length<1?res.send("No todos or users are entered") : res.redirect(`/users/${usertoodie}`)
    
    
})
// send file to filter
app.get("/filter/email", async (req,res)=>{
    const allUsers = await User.find({})
    const allTodo = await User.find({})
    const uCount = [...allUsers].length;
    const tCount = [...allTodo].length;
   try{
    if(tCount>0||uCount>0){
        res.sendFile(__dirname+'/views/filter3.html')
    }
    else{
        res.sendFile(__dirname+ "/views/noUsersFound.html")
    }
    }
    catch(err){
        console.log(err)
    }
})
// post list of users by similar email
app.post("/email/:email/", async (req,res)=>{
    console.log(filter_id)
    let emailtoodie,emailtoodie1,emailtoodie2,emailtoodie3;
    if(filter_id==undefined){
        // contains regex
         emailtoodie = req.body.email
         emailtoodie1 = emailtoodie+' '
         emailtoodie2 = ' '+emailtoodie
         emailtoodie3 = ' '+emailtoodie+' '
        }
    if(filter_id==1){
        // contains regex
         emailtoodie = req.body.email
         emailtoodie1 = emailtoodie+' '
         emailtoodie2 = ' '+emailtoodie
         emailtoodie3 = ' '+emailtoodie+' '
        }
        
        if(filter_id==2){
        // start-with regex
         emailtoodie = '^' + req.body.email
         emailtoodie1 = '^' + emailtoodie + ' '
         emailtoodie2 = '^' + ' '+emailtoodie
         emailtoodie3 = '^' + ' '+emailtoodie + ' '
    
        }
       if(filter_id==3){
        // ends-width regex
         emailtoodie = req.body.email + '$'
         emailtoodie1 = emailtoodie + ' ' + '$'
         emailtoodie2 = ' ' + emailtoodie + '$'
         emailtoodie3 = ' ' + emailtoodie + ' ' + '$'
    
       }
       if(filter_id==4){
        // ends-width regex
         emailtoodie = '\s' + req.body.email + '\s'
         emailtoodie1 = '\s' + emailtoodie + ' ' + '\s'
         emailtoodie2 = '\s' + ' ' + emailtoodie + '\s'
         emailtoodie3 = '\s' + ' ' + emailtoodie + ' ' + '\s'
    
       }
    let arr = []
    let filter = []
    const t = await Todo.find({})
    const u = await User.find({})
    let n;
    let i=0;
    let j = 0;
    let argEmail = new RegExp(emailtoodie)
    let argEmail1 = new RegExp(emailtoodie1)
    let argEmail2 = new RegExp(emailtoodie2)
    let argEmail3 = new RegExp(emailtoodie3)
    
        for( i; i < t.length,j < t.length&&j<t.length; i++ ){
            let user = u[i]
            let todo = t[i]
            let jemail = t[j].email 
            n={
                name:user.name,
                email:user.email,
                todo:todo.todo
            }
            if(argEmail.test(jemail)||argEmail1.test(jemail)||argEmail2.test(jemail)||argEmail3.test(jemail)){
                filter.push(n)
                // console.log('pass')
            }
            else{
                // console.log('fail')
            }
            j+=1
    
            // console.log(n)
            arr.push(n)
    
        }  
        return arr.length<1?res.send("No todos or users are entered") : res.redirect(`/email/${emailtoodie}`)
    
    
})
// get list of users by similar email
app.get("/email/:email/", async (req,res)=>{
    let emailtoodie,emailtoodie1,emailtoodie2,emailtoodie3;
    if(filter_id==undefined){
        // contains regex
         emailtoodie = req.params.email
         emailtoodie1 = emailtoodie+' '
         emailtoodie2 = ' '+emailtoodie
         emailtoodie3 = ' '+emailtoodie+' '
        }
    if(filter_id==1){
        // contains regex
         emailtoodie = req.params.email
         emailtoodie1 = emailtoodie+' '
         emailtoodie2 = ' '+emailtoodie
         emailtoodie3 = ' '+emailtoodie+' '
        }
        
        if(filter_id==2){
        // start-with regex
         emailtoodie = '^' + req.params.email
         emailtoodie1 = '^' + emailtoodie + ' '
         emailtoodie2 = '^' + ' '+emailtoodie
         emailtoodie3 = '^' + ' '+emailtoodie + ' '
    
        }
       if(filter_id==3){
        // ends-width regex
         emailtoodie = req.params.email + '$'
         emailtoodie1 = emailtoodie + ' ' + '$'
         emailtoodie2 = ' ' + emailtoodie + '$'
         emailtoodie3 = ' ' + emailtoodie + ' ' + '$'
    
       }
       if(filter_id==4){
        // ends-width regex
         emailtoodie = '\s' + req.params.email + '\s'
         emailtoodie1 = '\s' + emailtoodie + ' ' + '\s'
         emailtoodie2 = '\s' + ' ' + emailtoodie + '\s'
         emailtoodie3 = '\s' + ' ' + emailtoodie + ' ' + '\s'
    
       }
    let arr = []
    let filter = []
    const t = await Todo.find({})
    const u = await User.find({})
    let n;
    let i=0;
    let j = 0;
    let argEmail = new RegExp(emailtoodie)
    let argEmail1 = new RegExp(emailtoodie1)
    let argEmail2 = new RegExp(emailtoodie2)
    let argEmail3 = new RegExp(emailtoodie3)
    
        for( i; i < t.length,j < t.length&&j<t.length; i++ ){
            let user = u[i]
            let todo = t[i]
            let jemail = t[j].email
            n={
                name:user.name,
                email:user.email,
                todo:todo.todo
            }
            if(argEmail.test(jemail)||argEmail1.test(jemail)||argEmail2.test(jemail)||argEmail3.test(jemail)){
                filter.push(n)
                console.log('pass')
            }
            else{
                console.log('fail')
            }
            j+=1
    
            console.log(n)
            arr.push(n)
    
        }  
        return arr.length<1?res.send("No todos or users are entered") : res.json({email:[...filter]})
    
    
})
// get list of users by similar todo
app.get("/todo/:todo/", async (req,res)=>{
    let todoodie,todoodie1,todoodie2,todoodie3;

    if(filter_id==undefined){
        // contains regex
         todoodie = req.params.todo
         todoodie1 = todoodie+' '
         todoodie2 = ' '+todoodie
         todoodie3 = ' '+todoodie+' '
        }
        if(filter_id==1){
        // contains regex
         todoodie = req.params.todo
         todoodie1 = todoodie+' '
         todoodie2 = ' '+todoodie
         todoodie3 = ' '+todoodie+' '
        }
        
        if(filter_id==2){
        // start-with regex
         todoodie = '^' + req.params.todo
         todoodie1 = '^' + todoodie + ' '
         todoodie2 = '^' + ' '+todoodie
         todoodie3 = '^' + ' '+todoodie + ' '
    
        }
       if(filter_id==3){
        // ends-width regex
         todoodie = req.params.todo + '$'
         todoodie1 = todoodie + ' ' + '$'
         todoodie2 = ' ' + todoodie + '$'
         todoodie3 = ' ' + todoodie + ' ' + '$'
    
       }
       if(filter_id==4){
        // ends-width regex
         todoodie = '\s' + req.params.todo + '\s'
         todoodie1 = '\s' + todoodie + ' ' + '\s'
         todoodie2 = '\s' + ' ' + todoodie + '\s'
         todoodie3 = '\s' + ' ' + todoodie + ' ' + '\s'
    
       }
    let arr = []
    let filter = []
    const t = await Todo.find({})
    const u = await User.find({})
    let n;
    let i=0;
    let j = 0;
    let argTodo = new RegExp(todoodie)
    let argTodo1 = new RegExp(todoodie1)
    let argTodo2 = new RegExp(todoodie2)
    let argTodo3 = new RegExp(todoodie3)
    
        for( i; i < t.length,j < t.length&&j<t.length; i++ ){
            let user = u[i]
            let todo = t[i]
            let jtodo = t[j].todo
            n={
                name:user.name,
                email:user.email,
                todo:todo.todo
            }
            if(argTodo.test(jtodo)||argTodo1.test(jtodo)||argTodo2.test(jtodo)||argTodo3.test(jtodo)){
                filter.push(n)
                console.log('pass')
            }
            else{
                console.log('fail')
            }
            j+=1
    
            console.log(n)
            arr.push(n)
    
        }  
        return arr.length<1?res.send("No todos or users are entered") : res.json({todo:[...filter]})
    
    
})
app.get("/users/:user/", async (req,res)=>{ 
    let usertoodie,usertoodie1,usertoodie2,usertoodie3;
    if(filter_id==undefined){
        // contains regex
         usertoodie = req.params.user
         usertoodie1 = usertoodie+' '
         usertoodie2 = ' '+usertoodie
         usertoodie3 = ' '+usertoodie+' '
        }
    if(filter_id==1){
        // contains regex
         usertoodie = req.params.user
         usertoodie1 = usertoodie+' '
         usertoodie2 = ' '+usertoodie
         usertoodie3 = ' '+usertoodie+' '
        }
        
        if(filter_id==2){
        // start-with regex
         usertoodie = '^' + req.params.user
         usertoodie1 = '^' + usertoodie + ' '
         usertoodie2 = '^' + ' '+usertoodie
         usertoodie3 = '^' + ' '+usertoodie + ' '
    
        }
       if(filter_id==3){
        // ends-width regex
         usertoodie = req.params.user + '$'
         usertoodie1 = usertoodie + ' ' + '$'
         usertoodie2 = ' ' + usertoodie + '$'
         usertoodie3 = ' ' + usertoodie + ' ' + '$'
    
       }
       if(filter_id==4){
        // ends-width regex
         usertoodie = '\s' + req.params.user + '\s'
         usertoodie1 = '\s' + usertoodie + ' ' + '\s'
         usertoodie2 = '\s' + ' ' + usertoodie + '\s'
         usertoodie3 = '\s' + ' ' + usertoodie + ' ' + '\s'
    
       }
    let arr = []
    let filter = []
    const t = await Todo.find({})
    const u = await User.find({})
    let n;
    let i=0;
    let j = 0;
    let argUser = new RegExp(usertoodie,'i')
    let argUser1 = new RegExp(usertoodie1,'i')
    let argUser2 = new RegExp(usertoodie2,'i')
    let argUser3 = new RegExp(usertoodie3,'i')
    
        for( i; i < t.length&&j<t.length; i++ ){
            let user = u[i]
            let todo = t[i]
            let juser = u[j].name
            n={
                name:user.name,
                email:user.email,
                todo:todo.todo
            }
            if(argUser.test(juser)||argUser1.test(juser)||argUser2.test(juser)||argUser3.test(juser)){
                filter.push(n)
                console.log('pass')
            }
            else{
                console.log('fail')
            }
            j+=1
    
            console.log(n)
            arr.push(n)
    
        }  
        return arr.length<1?res.send("No todos or users are entered") : res.json({users:[...filter]})
    
    
})
//drop all users and todos
app.get("/dropall", async(req,res)=>{
    const allUsers = await User.find({})
    const allTodo = await Todo.find({})
    const uCount = [...allUsers].length;
    const tCount = [...allTodo].length;
   const d =  await User.deleteMany({})
   const e = await Todo.deleteMany({})
   console.log(d)
   console.log(e)
   try{
    if(tCount>0||uCount>0){
        res.sendFile(__dirname+ "/views/drop.html")
    }
    else{
        res.sendFile(__dirname+ "/views/falseDrop.html")
    }
   }
   catch(err){
    console.log(err)
   }
})
app.get("/drop-user", async (req,res)=>{
    const allUsers = await User.find({})
    const allTodo = await User.find({})
    const uCount = [...allUsers].length;
    const tCount = [...allTodo].length;
   try{
    if(tCount>0||uCount>0){
        res.sendFile(__dirname + '/views/dropUserForm.html')
    }
    else{
        res.sendFile(__dirname+ "/views/falseDrop.html")
    }
    }
    catch(err){
        console.log(err)
    }
})





app.listen(PORT,()=>{
console.log('you are listening on port ' + PORT)
})


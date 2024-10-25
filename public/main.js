const submit = document.querySelector('button[name=submit]')
const bod = document.querySelector('body')
let ul = document.querySelector('.list-container')
let port = window.location.port
let api = window.location.origin+'/users'
let textarea = document.querySelector('.textarea')
let users = []
let todos = []
let viewcode = document.querySelector('.view')
let viewbtn = document.querySelector('.view-btn')

if(textarea){
    textarea.classList.add('def-text')
    appendColMod(textarea.parentElement)
}
if(window.location.pathname!=='/form/users'){
// fetch
fetch(api).then(res=>{
    return res.json();
})
.then(d=>{
    let arr = [...d.users]
     for(let i = 0; i < arr.length; i++){
        users.push(arr[i])

     }
     for(let i = 0; i < users.length; i++){
        let li = document.createElement('li')
        li.setAttribute('class','list-item')
        // li.classList.add('list-item') alternate method of adding class
        li.classList.add('reject-highlight')
        
        li.classList.add('hide')
        li.textContent = `${users[i].name} ${users[i].email}\n${users[i].todo}`
        ul.appendChild(li)
        if(/anon/i.test(users[i].name)){
            li.style.background='#f00'
        }
            li.classList.remove('hide')
            li.classList.add('appear')
        // setTimeout(function(){
        //     li.classList.remove('hide')
        //     li.classList.add('appear')
        // },125*(i+1))
        // li.classList.add('appear')
     }

})
.catch(err=>{
    console.log(err)
})
}

 function autoTextFn(text, heading,speed) {
    text = [...text]//text.split``
    let i = 0, arr = [], len = text.length
    let timer = setInterval(() => {
      let take = text.shift(text[i])
      i += 1
      arr.push(take)
      heading.textContent = arr.join``
      // console.log(text)//sender
      // console.log(arr)//receiver
      // console.log(arr.length,len)//compare arr's length w/ original text length
      if (arr.length === len) clearInterval(timer)//clearInterval once both lengths are the same.
    }, !speed ? 50 : speed)
}
  
if(window.location.pathname=='/form/users'||window.location.pathname=='/views/create.html'){
    const create_seq = `// if user is not found in db, create new user
            if(!findUser){
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
        else{
            // if user is found, redirect it to GET user info
            res.redirect("/api/" + findUser.email + "/stored")
        }  
    `
    console.log(textarea)
    setTimeout(()=>{
        autoTextFn(create_seq,textarea,65)
    },1500)
    textarea
}
if(window.location.pathname=='/dropall'||window.location.pathname=='/views/drop.html'){
    const create_seq =`//drop all users and todos
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
    `
    setTimeout(()=>{
        autoTextFn(create_seq,textarea,65)
    },1500)
    textarea
}
if(window.location.pathname=='/users/specific/drop'||window.location.pathname=='/views/dropUser.html'){
    const create_seq = `//drop data with userId & email
    app.post('/users/spec/drop',async(req,res)=>{
        const id = req.body.id, email = req.body.currentemail
        const u = id ? await User.findById(id) : ''
        const t = await Todo.findOne({email:u.email})
        console.log(id,u)
        try{
            if(u && u.email==email){
                await User.deleteOne({_id:id})//user found
                await Todo.deleteOne({email:u.email})
                res.redirect("/")
            }
            else{
                res.sendFile(__dirname + '/views/permission.html')
            }
        }
        catch(err){
            console.log(err)
        }
    })
    `
    console.log(textarea)
    setTimeout(()=>{
        autoTextFn(create_seq,textarea,65)
    },1500)
    textarea
}
if(window.location.pathname=='/form/users/name/change'||window.location.pathname=='/views/nameChangeConfirm.html'){
    const create_seq = `app.post("/form/users/name/change", async (req,res)=>{
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
    })`
    console.log(textarea)
    setTimeout(()=>{
        autoTextFn(create_seq,textarea,65)
    },1500)
    textarea
}
if(window.location.pathname=='/form/users/email/change'||window.location.pathname=='/views/emailChangeConfirm.html'){
    const create_seq = `app.post("/form/users/email/change", async (req,res)=>{
        let {newemail,currentemail,id} = req.body
        let filter = id
        const findOne = id ? await User.findById(filter) : ''
        console.log(req.body)
        // console.log(findOne)
        try{
            if(findOne&&currentemail===findOne.email&&currentemail.length!==0){
                const updateEmail = await User.findOneAndUpdate({email:currentemail},{email:newemail},{new:true})
                res.sendFile(__dirname + '/views/emailChangeConfirm.html')
                return;
            }
            else{
                res.sendFile(__dirname + '/views/permission.html')
            }
        }
       
        catch(err){
            console.log(err)
        }
    })`
    console.log(textarea)
    setTimeout(()=>{
        autoTextFn(create_seq,textarea,65)
    },1500)
    textarea
}

window.addEventListener('click',e=>{

try{
    if(viewcode){
            if(e.target == viewbtn){
                viewcode.classList.toggle('appear-option')
                console.log('button clicked')
            }
            if(e.target == viewcode || e.target == viewcode.children[0]){
                viewcode.classList.remove('appear-option')
                console.log('yessir on children')
            }
    }
}
catch(err){
    console.log(err)
}

})

function appendColMod(area){
    const mod = document.createElement('div');
    mod.classList.add('mod-tog')
    mod.classList.add('tog-mod')
    area.appendChild(mod)
    // append ying yang icon here
    modTogClick(area,mod)
}

function modTogClick(area,mod){
mod.onclick = e => {
    if(area.children[0] == textarea){
        let ta = area.children[0] || textarea;
        if(ta.classList.contains('def-text')){
            ta.classList.remove('def-text')
            ta.classList.add('invert')
        }
        else {
            ta.classList.add('def-text')
            ta.classList.remove('invert')
        }
    }
    e.currentTarget.classList.toggle('invert-tog')
}
}



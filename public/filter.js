let filter_menu = document.querySelector('.option-btn')
const bod = document.querySelector('body')
let filter = document.querySelector("button")
let option_container = document.querySelector('.options')
let input = document.querySelector('.text-inp')
let textarea = document.querySelector('.textarea')
let viewcode = document.querySelector('.view')
let viewbtn = document.querySelector('.view-btn')
let container = document.getElementById('container-border')



let xhr = new XMLHttpRequest();

// filter functions
const choiceFilter = (event)     =>{
    let obj = {1:'contains',2:'starts with',3:'ends with',4:'space between'}
    let element = event.target
    let num = parseInt(element.classList[0])
    option_container.classList.remove('appear-option')
    

filter_menu.textContent = obj[num].toUpperCase()
    let elem = parseInt(element.classList[0]) // get the current number/id
    let myAsp = "/server/filter/choice"
    //open a request to http
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // create a req.body to send to the server (myASP) aka "/server/filter/choice"
           $.post(myAsp,{
            number: !elem ? 1 : elem
        },
        function(data,status){
            console.log("Data: "+data +"\nStatus: " + status)
        })
        }
    };
    xhr.open("GET", '/', true);
    xhr.send();
}
const choiceFilterhover = (event) =>{
    console.log(event.target)
    let obj = {1:'contains',2:'starts with',3:'ends with',4:'space between'}
    let element = event.target
    let num = parseInt(element.classList[0])

filter_menu.textContent = obj[num].toUpperCase()
}
const leaveContainer = () => {
    filter_menu.textContent = `filter menu`.toUpperCase()
}
const filterFn = () => {
    let hide = 'hide-option' // store class
    let options = [...option_container.children] // options under ul

    if(option_container.classList.contains(hide)){
        option_container.classList.toggle('appear-option')
    }
    // iterate through options and chose one
    options.forEach(op=>{
        op.addEventListener('click',choiceFilter)
        //op.addEventListener('mouseover',choiceFilterhover)
    })
}

filter_menu.addEventListener('click',filterFn)
window.addEventListener('click',e=>{
    console.log(e.target)
    try{

            
                if(e.target == viewbtn){
                    console.log('btn clicked')
                    viewcode.classList.toggle('appear-option')
                    container.classList.toggle('backdrop')
                }
            
        
        if(!e.target.classList.contains('outer-layer') && e.target !== viewbtn){
            console.log('yes touch me')
            container.classList.remove('backdrop')
            ul.classList.add('lighter')
            viewcode.classList.remove('appear-option')
        }
    }
    catch(err){
        console.log(err)
    }
    if (e.target !== option_container && e.target !== input && e.target !== filter_menu && !e.target.classList.contains('op')){
        option_container.classList.remove('appear-option')
    }
})

//_____________________________
const submit = document.querySelector('.filter-btn')
let ul = document.querySelector('.list-container')
let port = window.location.port
let classIndex = submit.classList.length-1
let formType = submit.classList[classIndex]
let api = window.location.origin+'/'+formType
let users = []
let todos = []
let val = '';
let counter = 0;
let chunk = []
let filterChunk = []
let currentLi;
// fetch code for api data
console.log(api)
const f = (api)=>{
    // fetch api
    fetch(api).then(res=>{
        return res.json();
    })
    .then(d=>{
        let arr = d[`${formType}`];
        for(let i = 0; i < arr.length; i++){
            users.push(arr[i])
        }
        
        for(let i = 0; i < users.length; i++){
            
            let li = document.createElement('li')
            li.setAttribute('class','list-item')
            li.classList.add('hide')
            li.textContent = `${users[i].name} ${users[i].email} ${users[i].todo}`
            ul.appendChild(li)
            if(/anon/i.test(users[i].name)){
                li.style.background='#f00'
            }
            filterChunk.push(li)
            setTimeout(function(){
                li.classList.remove('hide')
                li.classList.add('appear')
            },125*(i+1))
        }

        chunk.push(filterChunk)
        console.log('Filter chunk:')
        let rlen = filterChunk.length
        console.log(rlen)
        console.log('Current Query')
        console.log(filterChunk)
        let items = document.querySelectorAll('.list-item')
        currentLi = [...items].slice(-rlen)
        if(rlen<1){
            alert('Sorry,\nSearch does not match our records.\n\nTry again.')
        }
        // iterate through current ul
        let ula = [...ul.children]
        for(let i = 0; i < ula.length; i++){
            if(currentLi){
                if(!currentLi.includes(ula[i])){
                    ula[i].style='display:none;'
            }
            
        } 
    }
        // items.splice()

        // console.log('Round:\n')   
        // console.log(round)
        // console.log('Actual Chunk:\n')
        // console.log(round[round.length-1] ) 

    })
    .catch(err=>{
        console.log(err)
    })  
    return;
}
// on submit your api changes
submit.addEventListener('click',e=>{
    viewcode.classList.remove('appear-option')
    container.classList.remove('backdrop')
    ul.classList.add('lighter')
    e.preventDefault();
    val = ('/'+input.value);
    api = api + val
    // api = api.replace(/filter\//,'')
    // execute the fetch code for api data fn
    f(api)

    
    setTimeout(()=>{
        api = window.location.origin+'/'+formType
        users = []
        filterChunk=[]
    },10) 

})
window.addEventListener('load',e=>{
    api = window.location.origin+'/'+formType
    f(api)
})


//_______________________________________
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
if(window.location.pathname=='/filter/todo'||window.location.pathname=='/views/filter.html'){
    const create_seq = `app.post("/todo/:todo/", async (req,res)=>{

        let todoodie,todoodie1,todoodie2,todoodie3;
        console.log(filter_id)
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
            return arr.length<1?res.send("No todos or users are entered") : res.redirect("/todo/" + todoodie )
        
        
    })`
    setTimeout(()=>{
        autoTextFn(create_seq,textarea,75)
    },1500)
}
if(window.location.pathname=='/filter/users'||window.location.pathname=='/views/filter2.html'){
    const create_seq = `// get list of users by similar todo
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
            return arr.length<1?res.send("No todos or users are entered") : res.json({todo:[...filter]})`
    setTimeout(()=>{
        autoTextFn(create_seq,textarea,75)
    },1500)
}
if(window.location.pathname=='/filter/email'||window.location.pathname=='/views/filter3.html'){
    const create_seq = `// post list of users by similar email
    app.post("/users/:email/", async (req,res)=>{
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
            return arr.length<1?res.send("No todos or users are entered") : res.redirect("/users/" + emailtoodie)
        
        
    })`
    setTimeout(()=>{
        autoTextFn(create_seq,textarea,75)
    },1500)
}




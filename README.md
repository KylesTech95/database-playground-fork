# Mongoose/Mongodb - CRUD(Create, Read, Update, and Delete)

## Intro
A simple & interactive guide to understanding CRUD Storage/Database operations created with NodeJS, Mongoose and Mongodb.

## Languages: 
1. HTML
2. CSS
3. JavaScript
4. SQL

## Setup
- Before accessing your mongoDB dataset, you may want to install the required packages:

`npm install mongoose`
`const mongoose = require('mongoose')`
- In order to use an encrypted Variable(.env), you may want to install the required packages:

`npm install --save dotenv`
`require('dotenv').config();`
- In order to Build Applications & APIs, you may want to install the required packages:

`npm install express`
`const express = require('express');`

- Feel free to install nodemon, which monitors your activity and restarts scripts if any changes are made. 
This feature helps save time during the development process versus manually restarting your application after every change.

`npm install --save-dev nodemon`

**Terminal**:
Instead of Running:
`npm run start`
Utilize:
`nodemon myApp.js`

## Create

First, creating a dataset requires input (user-input or auto-generated) as well as developed _Schema_ for the data to _fit_ into.
_____________________
This process can be synonymous to _students attending a new classroom for the first time & being assigned to a seat by the teacher._
**You are the teacher and the data are your students.**
_____________________
Creating a schema can be developed in different ways and is going to be dependent on the application as far as data-types, amount of data entered, and the associations chosen between data.

For more information on starting your own mongoose schema, check the docs:[Mongoose Schemas](https://mongoosejs.com/docs/guide.html)


_**User1** is created after entering:_

1.Name<br>
2.Email<br>
3.Todo<br>

![New User](https://github.com/KylesTech95/database-playground-fork/blob/main/media/createNewUser.gif?raw=true?raw=true)

_**Anonymous0** user is created after entering:_

1._____<br>
2.Email<br>
3.Todo<br>

_**Feat:** Anonymous usernames increment automatically by filtering through the existing array of names that match **/Anonymous/** & obtaining the array's length_.
Store the modified array in a variable called _count_
Upon creating a new user, if a name is not stored, then **_"Anonymous" + count_** will take undefined's place.
`const newUser = new User({ 
                // create new user & email
                name:name?name:'Anonymous'+count,
                email
            })
            const sU = await newUser.save() //save user
            console.log(sU)
`
_***View the Code snippet for example codes**_

![new Anonymous User](https://github.com/KylesTech95/database-playground-fork/blob/main/media/createAnon.gif?raw=true?raw=true)

_**testUser** is created after entering:_

1.Name<br>
2.Email<br>
3._____<br>
_**Feat:** Users who do not store a todo will automatically be replaced with "n/a"_ . 
`            const todoObj = new Todo({
                email: sU.email,
                todo:todo ? todo : 'N/A'.toLowerCase()
            })
            const sTodo = await todoObj.save();
            console.log(sTodo)
`
_***View the Code snippet for example codes**_

![Create User with No Todo Input](https://github.com/KylesTech95/database-playground-fork/blob/main/media/createNoTodo.gif?raw=true?raw=true)

_**No User** is created after reaching the max capacity (10)_

`            // if user is not found in db, create new user
        if(!findUser){
            if(allUsers.length > 9){
                res.sendFile(__dirname + '/views/max.html')
            }
        }
`

_***View the Code snippet for example codes**_

![Max Users limitation](https://github.com/KylesTech95/database-playground-fork/blob/main/media/maxUsers.gif?raw=true)
____________
## Retrieve

**Retrieve** or **Read** operations in **C.R.U.D** involves searching data & receiving data. 
-Upon visiting one of the three **filtered** search endpoints, users can filter through data based on that type (users,todos,email).
-Else, users can scroll through the table to view all data.

![Filter search query](https://github.com/KylesTech95/database-playground-fork/blob/main/media/filterMethod.gif?raw=true)

In the event that the database is empty,
users will not be able to:
1. Drop User
2. Drop All Users
3. Filter todos
4. Filter Users
5. Filter email
6. Change Email
7. Change Name

Users will be redirected to a web page that states, "No Users Found"
![No users Found or Read](https://github.com/KylesTech95/database-playground-fork/blob/main/media/noUsersFound.gif?raw=true )

_____________
Remember that classroom analogy above?
Think of reading as _roll-call_ where the teacher is reading off of a list of user's names to determine who is absent or present.
**You, the teacher, are reading off of a list & filtering the present students from the absent students**
_____________

## Update

**Updating** allows the user to change already-existing data.
This process is not _Creating_ a data record. Existing data is in the process of being updated.

A POST request is sent to endpoint, "/form/users/email/change". User input is sent to the body object.
[Destructing Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) is used to extract values from the body's object (user input).
Take advantage of the _id_ property and use it as a _filter_.
Next, use the `model.findById()` function to find the record.

**Conditions**:  
1. If current & new email inputs contain an @ and is true
2. If a user is found
3. If the discovered user's email `findOne.email === currentemail` (input)

If the above conditions are met, execute the `model.findOneAndUpdate()` function

**example**:
`User.findOneAndUpdate({email:currentemail},{email:newemail},{new:true})`

**Update Name with current Name & ID**
![Update User's Name](https://github.com/KylesTech95/database-playground-fork/blob/main/media/changeName.gif?raw=true   )

**Update Email with current email & ID**
![Update User's Email](https://github.com/KylesTech95/database-playground-fork/blob/main/media/emailChange.gif?raw=true )

**Update fails**

![Update Permission Denied](https://github.com/KylesTech95/database-playground-fork/blob/main/media/permissionDenied.gif?raw=true   )

## Delete
**Deleting** specific data takes place with the `deleteOne()` function.
`await User.deleteOne({_id:id})//user found`
![Drop One User](https://github.com/KylesTech95/database-playground-fork/blob/main/media/dropUser.gif?raw=true  )

**Deleting Multiple** data takes place with the `deleteMany()` function.

`const d =  await User.deleteMany({})
   const e = await Todo.deleteMany({})`
![Drop All Users](https://github.com/KylesTech95/database-playground-fork/blob/main/media/dropAllUsers.gif?raw=true )

_____________________

_Web Link: [Database Playground](https://database-playground.onrender.com/) <br>
Git: [Github](https://github.com/KylesTech95/database-playground-fork)_



Alternatively, users can clone the repository
`https://github.com/KylesTech95/database-playground-fork.git`
and fork.






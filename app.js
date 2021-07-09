const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
    
      bodyParser            =  require("body-parser"),

      User                  =  require("./models/user");


//Connecting database
const DB="mongodb+srv://Atif:9794264902@cluster0.rco9m.mongodb.net/mystudents?retryWrites=true&w=majority";
mongoose.connect(DB,{ useNewUrlParser: true , useUnifiedTopology: true,})
.then(()=>{
    console.log('connection Successfull');
}).catch((err)=>console.log("no connection"));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


app.use(express.static('public'));
app.set('views', './views');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded(
      { extended:false }
))


//=======================
//      R O U T E S
//=======================

app.get("/", (req,res) =>{
    res.render("home");
})

app.get("/register",(req,res)=>{
    res.render("register")

})



app.post("/register",async (req,res)=>{
    try {
        console.log(req.body.username);
       
        const password=req.body.password;
        const confirmPassword=req.body.confirm_password;
        if(password===confirmPassword)
        {const registerStudent=new User({
            username: req.body.username,
            password:req.body.password,
            confirmPassword:req.body.confirm_password,
           email:req.body.email,
            phone:req.body.phone,
            image:req.body.image

        
            
        });
        const registered=await registerStudent.save();
            res.status(201).render('login');
        }
        else{
            res.send("wong pass word")
        }
        
    } catch (error) {
        res.status(400).send(error)
        
    }
})
app.get("/login",(req,res)=>{
res.render("login");
});

app.post("/login",async(req,res)=>{
    try {
        const password=req.body.password;
        const username=req.body.username;
        const name=await User.findOne({username:username});
       
        if(password===name.password)
        {
            res.status(201).render("userprofile",{user:name.username,image:name.image,email:name.email,phone:name.phone});
        }
        else{
            res.send("password details");
        }
        
    } catch (error) {
        res.status(400).send("invalid login details")
        
    }
  
    

    });
    
    app.post("/profile",async (req,res)=>{
     
            
            try {
                const password=req.body.password;
                const username=req.body.username;
                const name=await User.findOne({username:username});
                const update=await User.updateOne({_id:name.id},{$set:{
                 password:password

                }});
               console.log(name);
                
                    res.status(201).render("userprofile",{user:username});
                
             
                
            } catch (error) {
                res.status(400).send("invalid login details")
                
            }
            
     
      
        
    
        });
app.get('/cources',(req,res)=>{
    res.render("cources");
})
        

//Listen On Server
const PORT= process.env.PORT|| 10000 ;

app.listen(PORT,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log(`Server Started At Port ${PORT}`);
    }
      
});
var express = require("express")
var router = express.Router()

var Campground = require("../models/campground")
var Comment = require("../models/comment")



//INDEX -   Show all campgrounds
router.get("/",function(req,res){
        console.log(req.user._id)

    //Get all campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index",{campgrounds : allCampgrounds})
        }
    })
        
})

//NEW - show form to create new campground
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new")
})

//CREATE - add new campground to DB
router.post("/",isLoggedIn,function(req,res){
    //get data from form and add data to campgrounds array
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    
    var newCampGround = {name : name , image : image, description : desc,author :author}
    //Create a new campground and save to a database
    Campground.create(newCampGround,function(err,newlyCreated){
        if(err){
            console.log(err)
        }else{
            //redirect back to campgrounds page
            res.redirect("campgrounds/campgrounds")
        }
    })
    

})
// SHOW - shows more info about one campground
router.get("/:id",function(req,res){
    //Find the campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err)
        }else{
            //Render show template with that campground
            res.render("campgrounds/show",{campground : foundCampground})
        }

    })

})


//Edit - Shows the form for editing campgrounds
router.get("/:id/edit",function(req,res){
 
    Campground.findById(req.params.id,function(err,foundcampground){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/edit",{campground : foundcampground}) 
        }
    })
})

//UPDATE CAMPGROUND
router.put("/:id",function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})



//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}





module.exports = router
const { urlencoded } = require('express')
const express = require('express')
const app =  express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const article = require('./routes/articles')
const Article = require('./models/article')

app.use(express.urlencoded({extended: false})) 
app.set('view engine','ejs')
app.use(methodOverride('_method'))




mongoose.connect("mongodb://localhost/blog",()=>{
    console.log("Db conected")
})


app.get("/",async(req,res)=>{
    try 
    {
      const articles = await Article.find().sort({
          createdAt: 'desc'
      }) 
      res.render('articles/index',{articles: articles})
    } catch (error) 
    {
        console.log(error)
    }
  
})
app.use("/articles", article)

app.listen(3000, ()=>{
    console.log('app running at 3000')
})
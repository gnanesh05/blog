const express = require('express')
const { redirect } = require('express/lib/response')
const article = require('./../models/article')
const router = express.Router()
const Article = require('./../models/article')

// router.get('/', (req,res)=>{
//     res.send("hey articles")
// })

router.get('/new',(req,res)=>{
    res.render('articles/new',{article: new Article()})
})

router.get('/edit/:id', async(req,res)=>{
    try {
        const article =  await Article.findById(req.params.id)
        res.render('articles/edit', {article: article})
    } catch (error) {
        console.log(error)
    }
})
router.get('/:slug',async (req,res)=>{
    try 
    {
       const article = await Article.findOne({slug:req.params.slug})
       if(article ===null)
         res.redirect('/')
        
         
        res.render('articles/show',{article: article})
       
    } 
    catch (error) {
        console.log(error)
        res.redirect('/')
    }
   
})

// router.post('/', async (req,res)=>{
//     let article = new Article({
//         title: req.body.title,
//         description: req.body.description,
//         markdown: req.body.markdown
//     })
//     try {
//         article = await article.save()
//         res.redirect(`/articles/${article.slug}`)
//     } 
//     catch (error) {
//         console.log(error)
//         res.render('articles/new',{article: article})
//     }

    
// })

// router.put('/:id', (req,res)=>{

// })
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
  }, saveArticleAndRedirect('new'))
  
  
  router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
  }, saveArticleAndRedirect('edit'))

router.delete('/:id', async(req,res)=>{
    try {
        await Article.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        res.render(`articles/${path}`, { article: article })
      }
    }
  }

module.exports = router
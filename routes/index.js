var express = require('express');
var router = express.Router();

var Users = require('../models/users');
var Journals = require('../models/journals');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Your Journal' });
});

router.get('/signup',function(req,res){
  res.render('signup');
})

router.post('/signup',function(req,res){
  var user = new Users({
    username: req.body.username,
    password: req.body.password
  });
  var promise = user.save()
  promise.then((user)=>{
    console.log('User signed up with values',user);
    res.redirect('/login')
  })
});

router.get('/login',function(req,res){
  res.render('login');
})

router.get('/add',function(req,res){
  res.render('add');
});

router.post('/add',function(req,res){
  console.log('req.......',req.body);

  var journal = new Journals({
    title: req.body.title,
    journal: req.body.journal
  });
  var promise = journal.save()
  promise.then((journal)=> {
    console.log('added journal is:', journal);
    Journals.find().exec(function(err, journals){
      res.render('view',{journals})
    });
  });
});

router.post('/login',function(req, res){
  // console.log('req.......',req.body);
  if (req.body.username && req.body.password){
    Users.find({username: req.body.username, password: req.body.password},function(err, user){
      if(user!= null){
      console.log('logged in user is ...',user);
      res.redirect('/view');
      // res.render('add',{user});
    }else{
      console.log('Invalid user login');
    }
  });
  }else {
    console.log("Re-enter username and password");
   }
});

router.get('/view',function(req,res){
  Journals.find().exec(function(err, journals){
    res.render('view', {journals});
  })
});

router.get('/delete/:id', function(req, res) {
  Journals.findOneAndRemove({_id: req.params.id}, function(err, journal) {
    console.log('deleted journal is', journal);
    res.redirect('/view')
  });
});

router.get('/edit/:id', function(req, res) {
  Journals.findOne({_id: req.params.id}, function(err, journal) {
    console.log('edited journal is', journal);
    res.render('edit',{journal});
  });
});

router.post('/edit', function(req, res) {
  Journals.findOneAndUpdate({_id: req.body._id}, {$set: req.body},(err,journal)=>{
    console.log('journal updated', journal);
    if(!err) res.redirect('/view')
  });
});

router.use(express.static("public"));


module.exports = router;

'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Job = mongoose.model('Job');
var Page = mongoose.model('Page');
module.exports = router;

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/', ensureAuthenticated, function (req, res) {
    Job.find({User: req.user._id})
    .then(function(jobs) {
        res.send(jobs);
    })
    .catch(function(err) {
        console.log("Err:", err);
        res.status(501).send(err);
    })
});

router.post('/setCurrent/:jobId', ensureAuthenticated, function(req,res){
  if (req.session.currentProject)
    req.session.currentJob = req.params.jobId;
  res.sendStatus(201);
});

router.get('/getCurrent', ensureAuthenticated, function(req,res){
  res.json(req.session.currentJob);
});

//note: Schema does not currently support this route
router.get('/byProject/:projectId', ensureAuthenticated, function (req, res) {
    Job.find({Project: req.params.projectId})
    .then(function(jobs) {
        res.send(jobs);
    })
    .catch(function(err){
        console.log("Err:", err);
    })
});

router.get('/:id', ensureAuthenticated, function (req, res) {
    Job.findById(req.params.id).populate('pages')
    .then(function(job) {
        res.send(job);
    });
});

router.post('/:id/run', function(req,res,next){
  Job.findById(req.params.id).populate('pages')
  .then(function(job){
    return job.runJob();
  })
  .then(function(result){
    res.json(result);
  },next);
});

router.post('/', ensureAuthenticated, function (req, res) {
    req.body.user = req.user;
    Job.create(req.body)
    .then(function(job) {
        res.send(job);
    });
});

router.put('/:id', ensureAuthenticated, function (req, res) {
    Job.findById(req.params.id)
    .then(function(job) {
        Object.keys(Job.schema.paths).forEach(function(property) {
            if(req.body[property] !== undefined)
                job[property] = req.body[property];
        })
        return job.save();
    })
    .then(function(job) {
        res.send(job);
    });
});

router.delete('/:id', ensureAuthenticated, function (req, res) {
    Job.findByIdAndRemove(req.params.id)
    .then(function(job) {
        res.send(job);
    });
});

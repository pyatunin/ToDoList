var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
require('../model/task');

router.use(bodyParser.urlencoded({extended: true}));
router.use(methodOverride(function (req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

router.route('/')
	.get(function (req, res, next) {
		mongoose.model('Task').find({completed: false}, function (err, tasks) {
			if (err) {
				return console.error(err);
			} else {
				res.format({
					html: function () {
						res.render('tasks/index', {
							title: 'Список задач',
							tasks: tasks
						});
					},
					json: function () {
						res.json(tasks);
					}
				});
			}
		});
	})
	.post(function (req, res) {
		var task = req.body.task;
		mongoose.model('Task').create({
			task: task
		}, function (err, task) {
			if (err) {
				res.send('При добавлении новой задачи возникла ошибка: ' + err);
			} else {
				console.log('POST новая задача: ' + task);
				res.format({
					html: function () {
						res.redirect('/tasks');
					},
					json: function () {
						res.json(task);
					}
				});
			}
		})
	});

router.route('/completed')
	.get(function (req, res, next) {
		mongoose.model('Task').find({completed: true}, function (err, tasks) {
			if (err) {
				return console.error(err);
			} else {
				res.format({
					html: function () {
						res.render('tasks/index', {
							title: 'Список завершенных задач',
							tasks: tasks || []
						});
					},
					json: function () {
						res.json(tasks);
					}
				});
			}
		});
	});

router.param('id', function(req, res, next, id) {
	mongoose.model('Task').findById(id, function (err, task) {
		if (err) {
			console.log('задача с id = ' + id + ' не обнаружена');
			res.status(404);
			var err = new Error('Not Found');
			err.status = 404;
			res.format({
				html: function(){
					next(err);
				},
				json: function(){
					res.json({message : err.status  + ' ' + err});
				}
			});
		} else {
			req.id = id;
			next();
		}
	});
});

router.route('/:id')
	.put(function(req, res) {
		var completed = req.body.completed;
		mongoose.model('Task').findById(req.id, function (err, task) {
			task.update({
				completed: true
			}, function (err, taskID) {
				if (err) {
					res.send("Ошибка: " + err);
				}
				else {
					res.format({
						html: function(){
							res.redirect("/tasks");
						},
						json: function(){
							res.json(task);
						}
					});
				}
			})
		});
	})
	.delete(function (req, res){
		mongoose.model('Task').findById(req.id, function (err, task) {
			if (err) {
				return console.error(err);
			} else {
				task.remove(function (err, task) {
					if (err) {
						return console.error(err);
					} else {
						console.log('DELETE удалена задача: ' + task._id);
						res.format({
							html: function(){
								res.redirect("/tasks");
							},
							json: function(){
								res.json({message : 'deleted',
									item : task
								});
							}
						});
					}
				});
			}
		});
	});
module.exports = router;

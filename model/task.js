var mongoose = require('../libs/mongoose');
Schema = mongoose.Schema;

var taskSchema = new Schema({
	task: {
		type: String,
		require: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	created_at: {
		type: Date,
		default: Date.now()
	},
	completed_at: {
		type: Date
	}
});
exports.Task = mongoose.model("Task", taskSchema);
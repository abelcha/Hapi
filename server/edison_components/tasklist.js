var _ = require('lodash')
var TaskList = function() {

}


TaskList.prototype.getBoard = function(boardName) {
	var _this = this;
	return function(callback) {
		trello.get('members', 'me', 'boards')(function(err, boards) {
			var currentBoard = _.find(boards.body, 'name', boardName);
			if (err || !currentBoard) {
				return callback('no current board')
			}
			callback(null, currentBoard);
		})
	}
}



TaskList.prototype.getList = function(currentBoard) {
	var _this = this;
	return function(callback) {
		trello.get('boards', currentBoard.id, 'lists')(function(err, lists) {
			if (err) return callback(err);
			var currentList = _.find(lists.body, 'name', _this.date);
			if (!currentList) {
				trello.post('boards', currentBoard.id, 'lists', {
					name: _this.date
				})(function(err, resp) {
					callback(err, resp && resp.body)
				})
			} else {
				callback(null, currentList);
			}
		})
	}
}

TaskList.prototype.getCard = function(currentList) {
	var _this = this;
	return function(callback) {
		trello.get('lists', currentList.id, 'cards')(function(err, cards) {
			if (err) return callback(err);
			var currentCard = _.find(cards.body, 'name', _this.login)
			if (!currentCard) {
				trello.post('lists', currentList.id, 'cards', {
					name: _this.login
				})(function(err, resp) {
					callback(null, resp.body)

				})
			} else {
				callback(null, currentCard);
			}
		})
	}
}


TaskList.prototype.getChecklist = function(currentCard) {
	var _this = this;
	return function(callback) {
		trello.get('cards', currentCard.id, 'checklists')(function(err, checklists) {
			if (err) return callback(err);
			var currentChecklist = _.find(checklists.body, 'name', 'today')
			if (!currentChecklist) {
				trello.post('cards', currentCard.id, 'checklists', {
					value: null,
					name: 'today'
				})(function(err, resp) {
					callback(err, resp.body);
				})
			} else {
				callback(null, currentChecklist);
			}
		})
	}
}

TaskList.prototype.updateTask = function(item, callback) {
	trello.put('cards', item.cardID, 'checklist', item.listID, 'checkItem', item.id, {
		state: item.checked ? 'incomplete' : 'complete'
	})(function(err, resp) {
		callback(err, resp && resp.body)
	})
}

TaskList.prototype.getTasks = function(date, login, callback) {
	var _this = this;
	this.date = date
	this.login = login;
	var redisKey = "CARDID-" + date + login;
	redis.get(redisKey, function(err, reply) {
		if (!err && reply) {
			return _this.getChecklist({
				id: reply
			})(function(err, currentChecklist) {
				currentChecklist.cardID = reply
				callback(null, currentChecklist)
			})
		}
		_this.getBoard('TASKLIST')(function(err, currentBoard) {

			_this.getList(currentBoard)(function(err, currentList) {
				_this.getCard(currentList)(function(err, currentCard) {
					redis.set(redisKey, currentCard.id, _.noop);
					_this.getChecklist(currentCard)(function(err, currentChecklist) {
						currentChecklist.cardID = currentCard.id
						callback(null, currentChecklist)
					})
				})
			})
		})
	})

}
module.exports = TaskList;

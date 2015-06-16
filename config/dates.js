module.exports = function(d) {
	return Math.round(((new Date(d)).getTime() / 1000) - 1370000000)
}
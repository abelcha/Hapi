module.exports = function(d) {
	return Math.round(((new Date(d)).getTime() / 10000) - 137000000)
}
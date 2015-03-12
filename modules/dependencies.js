module.exports = {
// Configuration of the server 
	path: 			require('path'),
	favicon: 		require('serve-favicon'),
	logger: 		require('morgan'),
	cookieParser: 	require('cookie-parser'),
	bodyParser: 	require('body-parser'),
	session: 		require('express-session'),
	flash: 			require('connect-flash'),
}

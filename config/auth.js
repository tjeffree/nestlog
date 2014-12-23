// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'googleAuth' : {
		'clientID' 		: process.env['googleAuth.clientID'],
		'clientSecret' 	: process.env['googleAuth.clientSecret'],
		'callbackURL' 	: 'https://nestlog.herokuapp.com/auth/google/callback'
	},

	'nestAuth' : {
		'clientID' 		: process.env['nestAuth.clientID'],
		'clientSecret' 	: process.env['nestAuth.clientSecret'],
		'callbackURL' 	: 'https://nestlog.herokuapp.com/auth/nest/callback'
	}

};
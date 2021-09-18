const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const config = require('./config');
const auth = require('../modules/auth');
const { userLogin, info } = require('../modules/log');

passport.use(new GoogleStrategy({
	clientID: config.clients.google.id,
	clientSecret: config.clients.google.secret,
	callbackURL: config.applicationRoot + '/openid/google/finish',
	scope: ['profile', 'email', 'openid'],
}, function (accessToken, refreshToken, profile, done) {
	auth.authenticateUser(profile._json.email).then(user => {
		if(user !== null) {
			return done(null, user);
		} else {
			auth.createNewUser(profile._json.email, profile._json.name).then(user => {
				info(`Account ${user._id} created with role: none`);
				return done(null, user);
			}).catch(err => {
				return done(err, null);
			})
		}
	}).catch(error => {
		console.error(error);
		return done(error, null);
	})
}));

passport.use(new OIDCStrategy({
	clientID: config.clients.azure.id,
	clientSecret: config.clients.azure.secret,
	redirectUrl: config.applicationRoot + '/openid/azure/finish',
	identityMetadata: config.clients.azure.identityMetadata,
	responseType: 'id_token',
	responseMode: 'form_post',
	allowHttpForRedirectUrl: true,
	scope: ['profile', 'email', 'openid'],
	validateIssuer: true,
	issuer: config.clients.azure.issuer
}, function (iss, sub, profile, done) {
	auth.authenticateUser(profile._json.email).then(user => {
		if(user !== null) {
			return done(null, user);
		} else {
			auth.createNewUser(profile._json.email, profile._json.name).then(user => {
				info(`Account ${user._id} created with role: none`);
				return done(null, user);
			}).catch(err => {
				return done(err, null);
			})
		}
	}).catch(error => {
		console.error(error);
		return done(error, null);
	})
}));

passport.serializeUser(function (user, done) {
	console.log(user._id);
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {

	auth.findAuthenticatedUser(id).then(user => {
		if(user !== null) {
			console.log(user);
			return done(null, user);
		} else {
			console.log('No user found');
			return done('No user found', null);
		}
	}).catch(error => {
		console.error(error);
		return done(error, null);
	})
});
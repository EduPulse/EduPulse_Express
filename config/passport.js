const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const config = require('./config');

passport.use(new GoogleStrategy({
	clientID: config.clients.google.id,
	clientSecret: config.clients.google.secret,
	callbackURL: config.applicationRoot + '/openid/google/finish',
	scope: ['profile', 'email', 'openid']
}, function (accessToken, refreshToken, profile, done) {
	console.log('google');
    console.log(profile);
    return done(null, 'blah');
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
	console.log('azure');
    console.log(profile);
    return done(null, 'blah2');
}));

passport.serializeUser(function (user, done) {
	console.log('serializing');
	console.log(user);
	done(null, user);
});

passport.deserializeUser(function (id, done) {
	console.log('deserializing');
	console.log(id);
	done(null, id);
});
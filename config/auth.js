module.exports = {
    //or directly put them here
    'facebookAuth' : {
        'clientId' : process.env.FACEBOOK_CLIENT_ID || 'facebook_client_id_here',
        'clientSecret' : process.env.FACEBOOK_CLIENT_SECRET || 'facebook_client_secret',
        'callbackURL' : process.env.FACEBOOK_CALLBACK || 'https://hidden-savannah-63523.herokuapp.com/auth/facebook/callback'     //should be in this format or change in models/routes.js file
    },
    'twitterAuth' : {
        'consumerKey' : process.env.TWITTER_CONSUMER_KEY || 'twitter_consumer_key_here',
        'consumerSecret' : process.env.TWITTER_CONSUMER_SECRET || 'twitter_consumer_secret_here',
        'callbackURL' : process.env.TWITTER_CALLBACK || 'https://hidden-savannah-63523.herokuapp.com/auth/twitter/callback'
    },
    'googlekAuth' : {
        'clientId' : process.env.GOOGLE_CLIENT_ID || 'google_client_id_here',
        'clientSecret' : process.env.GOOGLE_CLIENT_SECRET || 'google_client_secret_here',
        'callbackURL' : process.env.GOOGLE_CALLBACK || 'https://hidden-savannah-63523.herokuapp.com/auth/google/callback'
    },
    'cloudinary' : {
        'cloud_name' : process.env.CLOUDINARY_CLOUD_NAME || 'cloudinary_cloudName_here',
        'api_key' : process.env.CLOUDINARY_API_KEY || 'cloudinary_api_key_here',
        'api_secret' : process.env.CLOUDINARY_API_SECRET || 'cloudinary_api_secret_here'
    }
};
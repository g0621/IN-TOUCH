# In-Touch
**Developed over**
[![N|Solid](http://javascript-html5-tutorial.com/wp-content/uploads/2015/02/nodejs-logo.png)](https://nodejs.org/en/)

In-Touch is a open source social network template with node.js backend.

  - Build over open-source/free services.
  - Ready to deploy code just set *Environment-Variables*.
  - Proper refractored code for easy modification.

# New Features!

  - Now user can have hassle free login via **Google** / **facebook** / **Twitter**.    (can be unlinked.)
  - Now more responsive and **Mobile-friendly**.
  - Now **Date/Time** of Post and Comments are more accurate.
  - User has now option to upload _**text-image**_ or _**text-only**_ uploads.
  - Ability to set custom *Display-name* besides differnt username.


You can also:
  - Comment on others post.
  - Edit/Delete your own post. 
  - Edit/Delete your own comment.

# Upcoming Features!
  - Live **Group-Chat** feature.
  - Live **Personal-Chat** feature.  
  
# Deployed Master Branch
Excited !!! lets visit together lol just kidding :p its still under development .  Here the Anchor for deployed Master bracnch **[In-Touch](https://hidden-savannah-63523.herokuapp.com/)**

> The theme is little childish
> because i did't get much time to polish it
> used simple bootstrap (documentation was too long :)
> Backgrounds can be changed by simply replacing
> pictures in public/img folder
> look/UI can be tweaked in public/css/style.css
> Instructions for Environment-variables are below

The User on Landing page were actually  my class mates. Their feedback was key part in debugging :) .

### Technology Used

In-Touch uses a number of open source projects to work properly:

* [NodeJS](https://nodejs.org/en/) - Server Side JavaScript runtime !
* [ExpressJS](https://expressjs.com/) - NodeJS module to handle routes.
* [Mongoose](http://mongoosejs.com/) - Node module to handle MONGODB.
* [Bootstrap](http://getbootstrap.com/) - To create responsive website.
* [Socket IO](https://socket.io/) - web Socket handler  (Currently working with).
* [PassportJS](http://passportjs.org/) - Handles session and user login.
* [Cloudinary](https://cloudinary.com/) - Handle mass flow of image and video uploads.
* [eJS](http://ejs.co/) - Embeded javaScript for nodeJS.
* [jQuery](https://jquery.com/) - javascript handler

And of course now In-Touch  itself is open source so can be used as base for more complex Social networks, Hope soo :) lol just kidding again.

### Installation

In-Touch requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies, set the Environment-Variables and start the server.

```sh
$ cd In-Touch
$ npm install -d
$ node app.js
```

### Setting up Environment-Variables

While deploying on servers like [Heroku](https://www.heroku.com/) set these environment variables or use them directly in your source.

| Name | Description | Location |
| ------ | ------ | ------ |
| SESSION_CRYPT_KEY | Used to Encrypt Session | /app.js
| MONGODB_URL | URL to your hosted database on [Mlab](https://mlab.com/) | /config/database.js
| FACEBOOK_CLIENT_ID | Generate while registering on facebook | /config/auth.js
| FACEBOOK_CLIENT_SECRET | Generate while registering on facebook | /config/auth.js
| FACEBOOK_CALLBACK | CallBack replace with your URL | /config/auth.js
| TWITTER_CONSUMER_KEY | Generate while registering on twitter | /config/auth.js
| TWITTER_CONSUMER_SECRET | Generate while registering on twitter | /config/auth.js
| TWITTER_CALLBACK | Replace with your URL | /config/auth.js
| GOOGLE_CLIENT_ID | Generate while registering on google | /config/auth.js
| GOOGLE_CLIENT_SECRET | Generate while registering on google | /config/auth.js
| GOOGLE_CALLBACK | Replace with your URL | /config/auth.js
| CLOUDINARY_CLOUD_NAME | Your cloudinary username | /config/auth.js
| CLOUDINARY_API_KEY | Your cloudinary API key | /config/auth.js
| CLOUDINARY_API_SECRET | Your cloudinary API secret | /config/auth.js


### Development

Want to contribute? or have some ideas Great! .Lets work together
#### Contact Me
 - [Facebook](https://www.facebook.com/gyan199)
 - [Whatsapp Me](#) (+91) 8107066370 

In-Touch can also be run Locally just install node and mongodb locally .
Make a change in your file and instantanously see your updates.

Open your favorite Terminal/bash/commandPrompt and run these commands (*cd into directory*).

First Tab:
```sh
$ mongod
```

Second Tab:
```sh
$ node app.js
```

(optional to see databse updates) Third:
```sh
$ mongo
```

### Todos

 - Implement live Chat (group & personal) almost done.
 - Redesign the User-Schema to implement friend/blocked etc.
 - Re-implement the UI/UX.

License
----

MIT


**Free Software, Hell Yeah!** (*just mention the repo link*)

//Importing Packages, Database, and HTML files

import {Template} from 'meteor/templating';
import { EJSON } from 'meteor/ejson';

import {List} from '../api/items.js';


import './body.html';

import './body.css';

import './dashboard.html';

import './leaderboard.html';

import './landing.html';

import './navbar.html';

import './footer.html';

import './sidebar.html';

import './login.html';

import './signup.html';

import './toc.html';

import './S3.html';

import './accounts.js';


//Subscribe to database collections

Meteor.subscribe('users'); //Subscribes to user collection

Meteor.subscribe('list'); //Subscribes to leaderboard collection


//App Title

Router.configure({
    
    title: 'The Offical GaryVee Flip Challenge Website'
    
    
    
});


//Routes

Router.route('/', function () { //Home Page
    return this.render('landing');

});

Router.route('/login', function () { //Login Page

    this.render('logIn');

});

Router.route('/signup', function () { //Signup Page

    this.render('signUp');

});

Router.route('/dashboard', function () { //Dashboard

    this.render('dashboard');
    
    fastRender: true;


});

Router.route('/termsandconditions', function() { //Terms and Conditions

    this.render('terms');
    
});


//Template Helpers for Website Navigation with Routing

Template.sidebar.events({
    
    'click .site-header__menu-icon': function (){
       	console.log("menu button clicked"); 
		$(".body__main").toggleClass("body__main--active");
		$(".body__side-menu").toggleClass("body__side-menu--active"); 
		
    }, 
    
    'click .side-menu__close-btn':function(){
		$(".body__main").removeClass("body__main--active");
		$(".body__side-menu").removeClass("body__side-menu--active");
	},
	
	'click .side-menu__item': function(){
	    $(".body__main").removeClass("body__main--active");
		$(".body__side-menu").removeClass("body__side-menu--active");
	}
    
});


Template.navbar.events({
    
    'click #at-nav-button': function () {
    
        Router.go('/login');

    },
    
    'click .site-header__menu-icon': function (){
       	console.log("menu button clicked"); 
		$(".body__main").toggleClass("body__main--active");
		$(".body__side-menu").toggleClass("body__side-menu--active"); 
		
    }, 
    
    'click .site-header__logo': function(){
        
        Router.go('/');
        
    },
    
    'click #dashboard-nav': function(event){

        event.preventDefault();
        Router.go('/dashboard');
        location.reload();

        
    }
    
});

Template.footer.events({
   
   'click #terms-of-use' : function() {
       
       Router.go('/termsandconditions');
       
   }
    
});

Template.sidebar.events({
    
    'click #signup-nav-sidebar': function(){
        
        Router.go('/signup');
        
    },
    
    'click #leaderboard-nav-sidebar': function(){
    
        Router.go('/');
        
    },
    
     'click #dashboard-nav-sidebar': function(){
    
        Router.go('/dashboard');
        location.reload();

    },

    'click #login-nav-sidebar': function(){
        
        Router.go('/login');

    }
    
});

Template.landing.events({
    
    'click .btn--gv-red': function(){ //Big red button on landing page
    
        Router.go('/signup');
        
    }
    
});

Template.logIn.events({
    
    'submit #at-pwd-form': function () { //Submit login form
        
        Accounts.onLogin(
            function(){
                Router.go('/dashboard');
                location.reload();
            });
        
    },
    
    'click #at-signUp': function () { //Link to signup form
    
        Router.go('/signup');

    }
    
});

Template.signUp.events({
    
    'submit #at-pwd-form': function () { //Submit signup form
        Accounts.onLogin(
            function(){
                Router.go('/dashboard');
                location.reload();
            });
            
    },
    
    'click #at-signIn': function () { //Link to login form
    
        Router.go('/login');

    }
    
});

//Template Helper for Navbar

Template.navbar.helpers({
    
    userName: function(){ //Returns user's name
        
        var name = Meteor.user().profile.fullName;
        
        return name;
        
    },    
    
});

Template.sidebar.helpers({
    
    userName: function(){ //Returns user's name
        
        var name = Meteor.user().profile.fullName;
        
        return name;
        
    },    
    
});


//Template Helper for Dashboard

Template.dashboard.helpers({
    
    userName: function(){ //Returns user's name
        
        var name = Meteor.user().profile.fullName;
        
        return name;
        
    },
    
    userProfession: function(){ //Returns user's profession
            
        var profession = Meteor.user().profile.profession;
        
        return profession;

    },
    
    userBio: function(){ //Returns user's bio
            
        var bio = Meteor.user().profile.bio;
        
        return bio;
        
    },

    userProfit: function(){ //Returns user's total profit
        
        var profit = Meteor.user().profit;
        
        return profit;
        
    },
    
    items: function(){ //Returns items user has flipped
        
        var items = Meteor.user().items;
        
        if(items.length == 0){ //If no items, return encouraging message.
        
            return "You have 0 items! Let's add some.";
            
        }
        
        else{
            
            return items; //Returns items. In HTML doc, template returns information for each item.
        }
    },
    
    userRanking: function(){ //Returns user's ranking
        
        var leaderboard = List.findOne({"name": "2017 Flip Challenge"});
        
        var id = Meteor.user()._id;

        var list = List.findOne({"name": "2017 Flip Challenge"}).competitors;
    
        for(var i = 0; i < list.length; i++){   
        
            if(_.sortBy(leaderboard.competitors, function(competitors) {return -competitors.profit;})[i]._id == id){ //_.sortBy() function sorts array.
            
                return i + 1; 
        
            }
        }  
        
        return _.sortBy(leaderboard.competitors, function(competitors) {
          
          return -competitors.profit;
        
        });

    },
    
    avatarPreview: function(){
        
        var selectedAvatar = Session.get('selectedAvatar');
        
        return selectedAvatar;
       

    }
        
});

Template.dashboard.events({
   
    'submit #add-item': function(event){ //Adds item to item list and updates profit.
        
        var itemName = event.target.itemName.value;
        var boughtFor = parseFloat(event.target.boughtFor.value);
        var soldFor = parseFloat(event.target.soldFor.value);
        var profit = soldFor - boughtFor;

        Meteor.call('addNewItem', itemName, boughtFor, soldFor, profit);
                
    },
    
    'click .delete-item':function(){
        
        var item = this;
        
        Session.set('item', item);
       
        var itemToDelete = Session.get('item');

        Meteor.call('removeItem', itemToDelete);
       
        location.reload();
        
        
    },
    
    'change .file_bag': function(){
        
        function getBase64(file) {
        
            var reader = new FileReader();
            reader.readAsDataURL(file);
        
            reader.onload = function () {
                Session.set('selectedAvatar', reader.result);
            };
        
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
        
		var files = $("input.file_bag")[0].files
            
        if (files.length > 0) {
        
                getBase64(files[0]);
        }
        
    },

    
   /* 'click #submit-profile': function(event){
        
        var name = event.target.name.value;
        var profession = event.target.userProf.value;
        var bio = event.target.userBiography.value;
    
        console.log(name + profession + bio);
        
        //Meteor.call('updateProfile', name, profession, bio);
        
        //location.reload();

    },
    
    TO BE MODIFIED
    
    */
    
    'click #delete-account': function(){
        
        var id = Meteor.user()._id;
        
        Meteor.call('deleteAccount', id);
        
        Router.go('/signup');
        location.reload();
        
    }
    
});

//Template Helpers for Leaderboard

Template.leaderboard.helpers({
   
    leaderboard: function(){ //Returns Competitors array sorted
        
        var leaderboard = List.findOne({"name": "2017 Flip Challenge"});
        return _.sortBy(leaderboard.competitors, function(competitors) {
          return -competitors.profit;
        });
        
        return leaderboard;
        
    },
    
    leaderboardMember: function(){ //Returns user object for leaderboard member
        
        var selectedPlayer = Session.get('selectedPlayer');

        var user = Meteor.users.findOne({"_id": selectedPlayer});
        
        return user;
        
    },
    
    leaderboardAvatar: function(){
        
        var avatar = Meteor.users.findOne({"_id": this._id}).profile.avatar;
        
        return avatar;
        
        
    },
    
    progressBar: function(){
        
        var selectedPlayer = Session.get('selectedPlayer');

        var profit = Meteor.users.findOne({"_id": selectedPlayer}).profit;
        
        var progress = ((profit / 20170) * 100).toFixed(2);
        
        return progress;
        
    }

});


//Template Events for Leaderboard
Template.leaderboard.events({
    
    'click .player': function(){ //Selects user to show their modal
        
        var playerId = this._id;
       
        Session.set('selectedPlayer', playerId);
       
        var selectedPlayer = Session.get('selectedPlayer');
       
    }
    
    
});

// Math Handlebars Helper

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

//Title Helper

Handlebars.registerHelper("setTitle", function() {
    var title = "";
    
    for (var i = 0; i < arguments.length - 1; ++i) {
        title += arguments[i];
    }
  
  document.title = title;
  
});

//Uploader Helper & Events

Template.uploader.events({

	"click button.upload": function(){
		
		var files = $("input.file_bag")[0].files;
		S3.upload({
		
				files : files,
				path : "subfolder"
		    
		},
		
		function(e,r){
		    

	    	var url = "https://s3-us-west-2.amazonaws.com/garyvee-dev/subfolder/" + r.file.name;
		    
		    Meteor.call('changeAvatar', url);
		    
		    console.log(r);
				
		});
	}
});

Template.uploader.helpers({
	"files": function(){
		return S3.collection.find();
	}
})
import { Meteor } from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {List} from '../imports/api/items.js';


Meteor.startup(() => {
  // code to run on server at startup
});


Meteor.methods({
    
    addNewItem: function(itemName, boughtFor, soldFor, profit){
                
        var user = Meteor.user();
        
        var items = Meteor.user().items;
        
        //Adds item to their dashboard        
        Meteor.users.update({_id: user._id},{$addToSet: { items: { _id: items.length, name:itemName, priceBought:boughtFor, priceSold:soldFor, profit: profit}}});
        
        //Updates User's profit on their dashboard
        Meteor.users.update({_id: user._id}, {$inc: {profit: profit}});
        
        //Updates User's profit on the Leaderboard
        List.update({name:"2017 Flip Challenge", "competitors._id": user._id }, {$inc: {"competitors.$.profit" : profit}});
            
    },
    
    
    removeItem: function(itemToDelete){
        
        var user = Meteor.user();
        
        //Adds item to their dashboard        
        Meteor.users.update({_id: user._id},{$pull: { items: {_id: itemToDelete._id} }});
        
        //Updates User's profit on their dashboard
        Meteor.users.update({_id: user._id}, {$inc: {profit: -itemToDelete.profit}});
        
        //Updates User's profit on the Leaderboard
        List.update({name:"2017 Flip Challenge", "competitors._id": user._id }, {$inc: {"competitors.$.profit" : -itemToDelete.profit}});
    
    },
    
    changeAvatar: function(newAvatar){
        
        var user = Meteor.user();
        
        //Changes the value of Meteor.user().profile.avatar
        Meteor.users.update({_id: user._id} , {$set:{"profile.avatar": newAvatar}});
        
        
    },
    
    
    /*
    
    updateProfile: function(name, profession, bio){
        
        var user = Meteor.user();
        
        //Changes the value of Meteor.user().profile to whatever each individual value is
        Meteor.users.update({_id: user._id} , {$set:{"profile.fullName": name, "profile.profession": profession, "profile.bio": bio}});
        
        
        
    }
    
    TO BE MODIFIED
    
    */
    
    deleteAccount: function(id){
        
        
        Meteor.users.remove({_id: id});
        List.update({name: "2017 Flip Challenge"},{$pull: { competitors: {_id: id} }});
        
    }
});



Accounts.onCreateUser((options, user) => {
    
    // Adds items array and profit to user's profile.
    const revisedUser = Object.assign({ items:[], profit: 0,}, user);
    
    // Keeps default hook's 'profile' behavior.
    if (options.profile) {
        revisedUser.profile = options.profile;
    }
    
    //Adds user to the leaderboard to get ranked
    List.update({name:"2017 Flip Challenge"},{$addToSet: { competitors: {_id: revisedUser._id, name: revisedUser.profile.fullName, profession: revisedUser.profile.profession, profit: revisedUser.profit}}});    
    
    return revisedUser;

    

});



// Pub/Sub

Meteor.publish('users', function(){
    
    return Meteor.users.find({});
    
}); 

Meteor.publish('list', function(){
    
    return List.find({name: "2017 Flip Challenge"});
    
}); 

//Configuring Amazon S3

S3.config = {
	key: 'AKIAJ6CIU6OEXMY52ACQ',
	secret: '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',
	bucket: 'garyvee-dev',
	region: 'us-west-2'
};
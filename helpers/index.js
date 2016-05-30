'use strict';
const router = require('express').Router();
const db = require('../db');

let findOne = profileId => {
    return db.userModel.findOne({
        'profileId': profileId
    })
}

let createNewUser = (profile,accessToken) => {
    return new Promise((resolve, reject) => {
        console.log(profile)
        let newChatUser = new db.userModel({
            profileId: profile.id,
            fullName: profile.name.givenName,
            profilePic: "",
            token: accessToken
        });

        newChatUser.save(error => {
            if (error) {
                console.log('Create New User Error');
                reject(error);
            } else {
                resolve(newChatUser);
            }
        });
    });
}

let findById = id => {
    return new Promise((resolve, reject) => {
        db.userModel.findById(id, (error, user) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
}



module.exports = {
    findOne,
    createNewUser,
    findById,

}

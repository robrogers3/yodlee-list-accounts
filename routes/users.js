var fs = require('fs');
var prettyjson = require('prettyjson');
var express = require('express');
var router = express.Router();
var tokenManagement = require('../token/tokenManagement')
var {storeJSONData, loadJSONData} = require('../fileOps/JSONDataManagement')
const superagent = require('superagent')

function isDev(req) {
    return req.app.get('env') === 'development'
}

router.get('/', function(req, res, next) {
    console.log('env???', req.app.get('env'), isDev(req))
    res.render('user_form.ejs', {title: 'User Form'})
});
router.post('/', function(req, res, next) {
    req.session.token = tokenManagement.generateUser(req.body.username)
    req.session.username = req.body.username
    res.redirect('/users/link')
});
router.get('/link', function(req, res, next) {
    res.render('user_link', {
	title: 'fastlink',
	username: req.session.username,
	token: req.session.token,
	fastlink_url: process.env.FASTLINK_URL
    });
});

router.get('/accounts', function(req, res, next) {
    const jsonPath = './accounts.json'
    var path = process.env.API_BASE_PATH + "/accounts"

    if (fs.existsSync(jsonPath)) {
        const data = loadJSONData(jsonPath)
        res.render('user_accounts', {accounts: JSON.stringify(data), username: req.session.username, title: 'User Accounts'})
        return;
    }


    superagent
	.get(path)
	.set('API-VERSION', '1.1')
	.set('Content-Type', 'application/json')
	.set('Authorization', `Bearer ${req.session.token}`)
	.then((yodleeRes) => {
            console.log(prettyjson.render(yodleeRes.body))
            storeJSONData(yodleeRes.body, jsonPath)
            res.render('user_accounts', {accounts: JSON.stringify(yodleeRes.body), username: req.session.username, title: 'User Accounts'})
	})
	.catch(err => {
	    res.json(err)
	})

});
router.get('/accounts/:id', function(req, res, next) {
    const jsonPath = `accounts.${req.params.id}.json`
    if (fs.existsSync(jsonPath)) {
        const data = loadJSONData(jsonPath)
        res.json(data.account[0])
        return
        //res.render('user_account', {account: JSON.stringify(data.account[0]), username: req.session.username, title: 'User Account'})
        //return;
    }
    var path = `${process.env.API_BASE_PATH}/accounts/${req.params.id}?container=${req.query.container}`
    superagent
	.get(path)
	.set('API-VERSION', '1.1')
	.set('Content-Type', 'application/json')
	.set('Authorization', `Bearer ${req.session.token}`)
	.then((yodleeRes) => {
            console.log(prettyjson.render(yodleeRes.body))
            console.log(Object.keys(yodleeRes.body))
            storeJSONData(yodleeRes.body, jsonPath)
            res.json(yodleeRes.body.account[0])
            //res.render('user_account', {account: JSON.stringify(yodleeRes.body), username: req.session.username, title: 'User Account'})
	})
	.catch(err => {
	    res.json(err)
	})

})
module.exports = router;

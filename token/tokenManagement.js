const jwt = require('jsonwebtoken')
const fs = require('fs')

const tokenManagement = {

    generateAdmin: function() {
	const privateKey = process.env.PRIVATE_KEY
	const issueTime = Math.floor(Date.now() / 1000)
	const expiryTime = issueTime + 900

	const payload = {
	    iss: process.env.ISSUER_ID,
	    iat: issueTime,
	    exp: expiryTime
	}

	const options = {
	    algorithm: "RS512",
	    header: {
		type: "JWT"
	    }
	}

	return jwt.sign(payload, privateKey, options)
    },

    generateUser: function(username) {
        const privateKey = PRIVATE_KEY
	const issueTime = Math.floor(Date.now() / 1000)
	const expiryTime = issueTime + 900

	const payload = {
	    iss: process.env.ISSUER_ID,
	    iat: issueTime,
	    exp: expiryTime,
	    sub: username
	}

	const options = {
	    algorithm: "RS512",
	    header: {
		type: "JWT"
	    }
	}

	return jwt.sign(payload, privateKey, options)
    }
}

module.exports = tokenManagement

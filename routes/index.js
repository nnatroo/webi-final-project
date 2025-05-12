const express = require('express');
const {connectDatabase} = require("../database/database");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    connectDatabase();
    if (req.session.user) {
        return res.redirect('/blogs');
    }
    res.redirect('/login')
});

module.exports = router;

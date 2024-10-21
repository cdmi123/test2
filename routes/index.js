var express = require('express');
var router = express.Router();

var user = require('../controller/usercontroller');
var auth = require('../middleware/auth');


router.post('/',user.index);
router.get('/',auth.check_token,user.get_data);
router.get('/delete/:id',user.delete_data);
router.get('/update/:id',user.get_update_data);
router.post('/update/:id',user.update_data);

// login url
router.post('/login',user.login);

// Logout
router.get('/logout',user.logout);







module.exports = router;

var usermodel = require('../model/usermodel');
const storage = require('node-persist');
storage.init( /* options ... */ );
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'languagepdf@gmail.com',
      pass: 'mdit ehnr sqri vrkn'
    }
  });

exports.index = (req,res) =>{


    var mailOptions = {
        from: 'languagepdf@gmail.com',
        to: req.body.email,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.status(200).json({
                error
            })
        } else {
             var data = usermodel.create(req.body);
             res.status(200).json({
                status:"success"
            })
        }
      });
}

exports.get_data = async (req,res) =>{

    var login_status = await storage.getItem('login_status');

    if(login_status===undefined){
        res.status(200).json({
            status:"Plzz Login user"
        })
    }else{

        var data = await usermodel.find();
        res.status(200).json({
            status:"success",
            data
        })
    }
}

exports.delete_data = async (req,res) =>{
    var id = req.params.id;
    var data = await usermodel.findByIdAndDelete(id);
    res.status(200).json({
        status:"success"
    })
}

exports.get_update_data = async (req,res) =>{
    var id = req.params.id;
    var data = await usermodel.findById(id);
    res.status(200).json({
        status:"success",
        data
    })
}

exports.update_data = async (req,res) =>{
    var id = req.params.id;
    var data = await usermodel.findByIdAndUpdate(id,req.body);
    res.status(200).json({
        status:"success"
    })
}

// Login API:

exports.login = async (req,res) =>{

    var data = await usermodel.find({email:req.body.email});

    var login_status = await storage.getItem('login_status');

    if(login_status==undefined)
    {
        if(data.length==1)
        {
            if(data[0].password==req.body.password)
            {
                await storage.setItem('login_status',data[0].id)
                var token = jwt.sign({ id:data[0].id}, 'cdmi');
                res.status(200).json({
                    status:"Login Success",
                    token
                })
            }
            else    
            {
                res.status(200).json({
                    status:"check your email and password"
                })
            }
        }
        else    
        {
            res.status(200).json({
                status:"check your email and password"
            })
        }
    }
    else{
        res.status(200).json({
            status:"user is already login"
        })
    }
}

exports.logout = async (req,res) => {

    await storage.clear();
    res.status(200).json({
        status:"User Logout"
    })
}
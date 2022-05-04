const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const async = require("async");
const crypto = require("crypto");
const middleware = require("../middleware");


//////SIGN UP
module.exports.register = async (req, res, next) => {
    const { email, username, password ,name ,last_name,birth_date} = req.body;
    const NewUser = new User({ email, username, emailToken: crypto.randomBytes(64).toString('hex'),name,last_name ,birth_date});
    
    if (req.body.adminCode === 'secretcode123') {
        NewUser.isAdmin = true;
        NewUser.Role='Admin'
    }
    console.log(NewUser.email);
    await User.register(NewUser, password, async (err, user) => {
        NewUser.isAdmin=false;
        let smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,   
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD_EMAIL
            }
        });
        /////SENDING MAIL VERIFICATION
        let mailOptions = {
            to: NewUser.email,
            from: process.env.EMAIL,
            subject: 'Node.js Email Verification',
            text:
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/verify-email/' + NewUser.emailToken + '\n\n' +
                'If you did not request this, please ignore this email .\n'
        };
        try {
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('thanks for registration');
                res.send('thanks for registration')

            })
        } catch (error) { console.log(error) };
    })
};
//////VERIFIYING THE EMAIL
module.exports.verifyEmail = (req, res) => {
    User.findOne({ emailToken: req.params.token }, function (err, user) {
        if (!user) {
            console.log('Verification mail token is invalid.');
        }
        user.emailToken = null;
        user.isVerified = true;
        user.save();
        res.send('Email verified!');
        req.login(user, err => {
            if (err) return next(err);
            console.log('Email verified!');
        })
    });
};

////////SIGN IN
module.exports.login = (req, res, next) => {
  
    passport.authenticate('local', { session: false }, (err, user, info) => {
        
        if (err || !user) {
            console.log("aab");
            return res.status(400).json({
                message: 'Username or password is wrong'
            });
        }
        if (err || user.isVerified == false) {
            return res.status(400).json({
                message: 'You have to verify your email'
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user.toJSON(), 'secret code');

            console.log("connected");
            return res.json({ user, token });
        });
    })(req, res);
}

/////LOGOUT
module.exports.logout = (req, res) => {
    req.logout();
    res.send('BYY!!')
    console.log('GoodBye!');
}

//////FORGET PASSWORD
module.exports.forgot = (req, res, next) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    console.log('No account with that email address exists.')
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD_EMAIL
                }
            });
            var mailOptions = {
                to: user.email,
                from: process.env.PASSWORD_EMAIL,
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + "localhost:3006" + '/reset/' + user._id + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                res.send("mail sent");
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
    });
};
/////VERIFYING FORGET PASSWORD TOKEN
module.exports.GetResetToken = (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            console.log('Password reset token is invalid or has expired.');
        }
        res.render('reset', { token: req.params.token });
    });
};
////////SAVING THE NEW PASSWORD
module.exports.PostResetToken = (req, res) => {
    async.waterfall([
        function (done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    console.log('Password reset token is invalid or has expired.');

                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function (err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function (err) {
                            req.logIn(user, function (err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    console.log("Passwords do not match.");
                }
            });
        },
        //////SENDING CONFIRMATION MAIL FOR CHANGING THE PASSWORD 
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: '4twin6@gmail.com',
                    pass: 'twintwin'
                }
            });
            var mailOptions = {
                to: user.email,
                from: '4twin6@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('Success! Your password has been changed.');
                done(err);
            });
        }
    ], function (err) {
        return err;
    });
};
//////MODIFY PROFILE
module.exports.editUser = async (req, res) => {
    User.findOne({ id: req.params.id }, function (err, Modifieduser) {
        if (!Modifieduser) {
            console.log('email invalid.');
        }
        const { username, password } = req.body;
        if (username != "") { Modifieduser.username = username; }
        if (password != "") { Modifieduser.password = password; }
        Modifieduser.save();

        console.log('Welcome!');
        res.send('user Modified')
    });

};
module.exports.ResetPass = async (req, res) => {
    User.findOne({ id: req.params.id }, function (err, Modifieduser) {
        if (!Modifieduser) {
            console.log('email invalid.');
        }
        const { password } = req.body;
    if (password != "") { Modifieduser.setPassword(req.body.password,function(err, user){}) }
        Modifieduser.save();

        console.log('Welcome!');
        res.send('user Modified')
    });

};

module.exports.profile = (req, res) => {
    User.findOne({ _id: req.params.id }, function (err, FoundUser) {
        if (err) { return err }
        res.send(FoundUser);
    })
}


module.exports.DeleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.send(err);
        } else {

            res.send("User Deleted Or not found");
        }
    })
}


module.exports.UsersList = (req, res) => {
    if (req.query.id) {
      const id = req.query.id;
      User
        .findById(id)
        .then((data) => {
          if (!data) {
            res.status(404).send({ message: "Not found user with id" + id });
          } else {
            res.send(data);
          }
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Error retrieving user with id " + id });
        });
    } else {
      User
        .find()
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Error Occured while retriving user Information",
          });
        });
    }
  };

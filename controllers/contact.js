

const nodemailer = require("nodemailer");


exports.create = async (req, res) => {
    console.log(req.body);
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mailforforgot@gmail.com',
            pass: 'Forgotpassword1'
        }
    });
    var mailOptions = {
        to: "yassineusm1@gmail.com",
        from: "4twin6@gmail.com",
        subject: 'Contact Client',
        text: 'Name: '+req.body.Name+'\n\n' +
            'Phone: '+req.body.Phone+'\n\n' +'Email: '+req.body.Email+'\n\n'+
            'Message: '+req.body.Msg+'\n\n'
    };
    smtpTransport.sendMail(mailOptions, function (err) {
        console.log('msg Envoyer');
        done(err);
    });
}
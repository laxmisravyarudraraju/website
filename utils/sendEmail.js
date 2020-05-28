const nodemailer = require('nodemailer');

const pug = require('pug');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

module.exports = class Email {
    constructor(user, url) {
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.mailOptions = {
            from: 'Laxmi Sravya Rudraraju',
            to: user.email,
            subject: '',
            html: ''
        };
    }

    async send(template, subject) {
        this.mailOptions.subject = subject;
        this.mailOptions.html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
            url: this.url,
        });

        await transporter.sendMail(this.mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    }

    sendWelcome() {
        this.send('welcome', 'Welcome Aboard!');
    }

    sendResetPassword() {
        this.send('reset-password', 'Reset Password!');
    }
}
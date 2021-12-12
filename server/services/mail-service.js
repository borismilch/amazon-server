import nodemailer from 'nodemailer'


class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          logger: true,
          debug: true,
         
          auth: {
            user: 'builitomil@gmail.com',
            pass: 'Udafen60'
          },
          tls: {
            rejectUnauthorized: false
          }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html:
            `
              <div>
                  <h1>Для активации перейдите по ссылке</h1>
                  <a href="${link}">${link}</a>
              </div>
            `
        })
    }
}

export default new MailService();
import nodemailer, { Transporter } from 'nodemailer';
import IEmailProvider from '../models/IEmailProvider';

class EtherealMailProvider implements IEmailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendEmail(to: string, body: string): Promise<void> {
    const message = await this.client.sendMail({
      from: 'Lucas Engel <lucas@hacke.co>',
      to,
      subject: '🔑 Password reset request',
      text: body,
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default EtherealMailProvider;

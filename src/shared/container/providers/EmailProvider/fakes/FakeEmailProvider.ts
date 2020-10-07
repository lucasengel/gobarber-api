import ISendEmailDTO from '../dtos/ISendEmailDTO';
import IEmailProvider from '../models/IEmailProvider';

class FakeEmailProvider implements IEmailProvider {
  private messages: ISendEmailDTO[] = [];

  public async sendEmail(message: ISendEmailDTO): Promise<void> {
    this.messages.push(message);
  }
}

export default FakeEmailProvider;

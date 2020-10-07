import ISendEmailDTO from '../dtos/ISendEmailDTO';

export default interface IEmailProvider {
  sendEmail(data: ISendEmailDTO): Promise<void>;
}

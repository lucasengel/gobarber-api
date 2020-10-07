import IEmailTemplateProvider from '../models/IEmailTemplate';

class FakeEmailTemplateProvider implements IEmailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}

export default FakeEmailTemplateProvider;

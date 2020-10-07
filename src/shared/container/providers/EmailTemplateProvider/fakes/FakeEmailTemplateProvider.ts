import IParseEmailTemplateDTO from '../dtos/IParseEmailTemplateDTO';
import IEmailTemplateProvider from '../models/IEmailTemplate';

class FakeEmailTemplateProvider implements IEmailTemplateProvider {
  public async parse({
    template,
    variables,
  }: IParseEmailTemplateDTO): Promise<string> {
    return template;
  }
}

export default FakeEmailTemplateProvider;

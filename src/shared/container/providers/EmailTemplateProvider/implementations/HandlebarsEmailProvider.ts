import handlebars from 'handlebars';

import IParseEmailTemplateDTO from '../dtos/IParseEmailTemplateDTO';
import IEmailTemplateProvider from '../models/IEmailTemplate';

class HandlebarsEmailProvider implements IEmailTemplateProvider {
  public async parse({
    template,
    variables,
  }: IParseEmailTemplateDTO): Promise<string> {
    const parseTemplate = handlebars.compile(template);

    return parseTemplate(variables);
  }
}

export default HandlebarsEmailProvider;

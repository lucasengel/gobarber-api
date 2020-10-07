import fs from 'fs';
import handlebars from 'handlebars';

import IParseEmailTemplateDTO from '../dtos/IParseEmailTemplateDTO';
import IEmailTemplateProvider from '../models/IEmailTemplate';

class HandlebarsEmailProvider implements IEmailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseEmailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, 'utf-8');

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsEmailProvider;

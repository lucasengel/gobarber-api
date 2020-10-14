import { container } from 'tsyringe';

import IMailTemplateProvider from './models/IMailTemplate';
import HandlebarsMailProvider from './implementations/HandlebarsMailProvider';

const providers = {
  handlebars: HandlebarsMailProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);

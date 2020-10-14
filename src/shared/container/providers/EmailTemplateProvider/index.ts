import { container } from 'tsyringe';

import IEmailTemplateProvider from './models/IEmailTemplate';
import HandlebarsEmailProvider from './implementations/HandlebarsEmailProvider';

const providers = {
  handlebars: HandlebarsEmailProvider,
};

container.registerSingleton<IEmailTemplateProvider>(
  'EmailTemplateProvider',
  providers.handlebars,
);

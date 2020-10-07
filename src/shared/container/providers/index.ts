import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IEmailProvider from './EmailProvider/models/IEmailProvider';
import EtherealMailProvider from './EmailProvider/implementations/EtherealMailProvider';

import IEmailTemplateProvider from './EmailTemplateProvider/models/IEmailTemplate';
import HandlebarsEmailProvider from './EmailTemplateProvider/implementations/HandlebarsEmailProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerInstance<IEmailProvider>(
  'EmailProvider',
  new EtherealMailProvider(),
);

container.registerSingleton<IEmailTemplateProvider>(
  'EmailTemplateProvider',
  HandlebarsEmailProvider,
);

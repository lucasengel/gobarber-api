import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IEmailProvider from './EmailProvider/models/IEmailProvider';
import EtherealEmailProvider from './EmailProvider/implementations/EtherealEmailProvider';

import IEmailTemplateProvider from './EmailTemplateProvider/models/IEmailTemplate';
import HandlebarsEmailProvider from './EmailTemplateProvider/implementations/HandlebarsEmailProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<IEmailTemplateProvider>(
  'EmailTemplateProvider',
  HandlebarsEmailProvider,
);

container.registerInstance<IEmailProvider>(
  'EmailProvider',
  container.resolve(EtherealEmailProvider),
);

import mailConfig from '@config/mail';

import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IEmailTemplateProvider from './EmailTemplateProvider/models/IEmailTemplate';
import HandlebarsEmailProvider from './EmailTemplateProvider/implementations/HandlebarsEmailProvider';

import IEmailProvider from './EmailProvider/models/IEmailProvider';
import EtherealEmailProvider from './EmailProvider/implementations/EtherealEmailProvider';
import SESEmailProvider from './EmailProvider/implementations/SESEmailProvider';

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
  mailConfig.driver === 'ethereal'
    ? container.resolve(EtherealEmailProvider)
    : container.resolve(SESEmailProvider),
);

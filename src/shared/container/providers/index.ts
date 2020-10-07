import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IEmailProvider from './EmailProvider/models/IEmailProvider';
import EtherealMailProvider from './EmailProvider/implementations/EtherealMailProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerInstance<IEmailProvider>(
  'EmailProvider',
  new EtherealMailProvider(),
);

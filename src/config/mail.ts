interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      name: string;
      address: string;
    };
  };
}

export default {
  driver: `${process.env.MAIL_DRIVER || 'ethereal'}`,

  defaults: {
    from: {
      name: 'Lucas Engel',
      address: 'hi@hacke.co',
    },
  },
} as IMailConfig;

import uploadConfig from '@config/upload';
import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @Column()
  @Exclude()
  password: string;

  @Expose({ name: 'avatar_url' })
  getAvatarURL(): string | null {
    if (!this.avatar) return null;

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;

      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.ca-central-1.amazonaws.com/${this.avatar}`;

      default:
        return null;
    }
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;

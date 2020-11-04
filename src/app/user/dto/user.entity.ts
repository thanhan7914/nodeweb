import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';
import { Exclude } from 'class-transformer';
import { ROLES } from 'src/helpers/decorators/auth.decorator';
import { UserToken } from 'src/app/auth/dto/user-token.entity';

@Entity({ name: 'users' })
export class User extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
    })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        type: 'varchar',
        default: ROLES.USER,
        enum: ROLES,
    })
    role: ROLES;

    @Column({
        type: 'boolean',
        default: true,
    })
    isActive: boolean;

    @Column({
        type: 'timestamp',
        default: null,
    })
    lastLoginAt: Date;

    @Column()
    timetreeToken: string;

    @Column()
    timetreeCalendar: string;

    @OneToMany(
        () => UserToken,
        (token) => token.user,
    )
    tokens: UserToken[];
}

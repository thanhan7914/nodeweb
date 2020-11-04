import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Model } from 'src/core/model';
import { User } from 'src/app/user/dto/user.entity';

@Entity({ name: 'user_tokens' })
export class UserToken extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    userId: number;

    @Column({ type: 'datetime' })
    expire: Date | string | null;

    @Column()
    token: string;

    @ManyToOne(
        (type) => User,
        (user) => user.tokens,
    )
    @JoinColumn()
    user: User;
}

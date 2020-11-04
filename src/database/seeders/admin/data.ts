import { passwordHash } from 'src/helpers';
import { ROLES } from 'src/helpers/decorators/auth.decorator';

export interface IUser {
    email: string;
    password: string;
    role: string;
}

export const admins: IUser[] = [
    {
        email: 'admin@admin.com',
        password: passwordHash('Abcd@1234'),
        role: ROLES.ADMIN,
    },
];

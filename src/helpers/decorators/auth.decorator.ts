import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../app/auth/guards/jwt.guard';
import { applyDecorators } from '@nestjs/common';

export enum ROLES {
    USER = 'user',
    ADMIN = 'admin',
}

export const Auth = (...roles: ROLES[]) => {
    return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard));
};

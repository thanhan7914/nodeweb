import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from '../../../helpers/decorators/auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        const roles = this.reflector.get<ROLES[]>('roles', context.getHandler());
        if (!roles || roles.length === 0 || roles.includes(user.role)) {
            return user;
        }

        throw new UnauthorizedException();
    }
}

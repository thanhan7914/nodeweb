import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../../config/jwt.config';
import { JwtPayload } from './interfaces/jwt-payload.inferface';
import { AuthService } from './auth.service';
import { User } from '../user/dto/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true,
        });
    }

    async validate(req: any, payload: JwtPayload) {
        const token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        const user: User = await this.authService.validateUser(payload, token);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}

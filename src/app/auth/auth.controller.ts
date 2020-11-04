import { Body, Controller, Post } from '@nestjs/common';
import { CredentialsDto } from './dto/credentials.dto';
import { UserService } from '../user/user.service';
import { AppLogger } from '../../core/logger';
import { JwtDto } from './dto/jwt.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    private logger = new AppLogger(AuthController.name);

    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

    @Post('login')
    @ApiOkResponse({ description: 'OK', type: JwtDto })
    @ApiBadRequestResponse({ description: 'validations error' })
    @ApiUnauthorizedResponse({ description: 'unauthorized' })
    public async login(@Body() credentials: CredentialsDto): Promise<any> {
        const user = await this.userService.login(credentials);
        this.logger.debug(`[login] User ${credentials.email} logging`);
        return this.authService.createAuthToken(user);
    }
}

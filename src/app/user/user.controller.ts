import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './dto/user.entity';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth, ROLES } from 'src/helpers/decorators/auth.decorator';
import { Resource } from 'src/helpers/decorators/resource.decorator';
import { UserResource } from './resource/user.resource';

@Controller('users')
@ApiTags('user')
export class UserController {
    constructor(
        private readonly usersService: UserService,
    ) {}

    @Auth(ROLES.USER)
    @ApiOkResponse({ description: 'OK' })
    @ApiBadRequestResponse({ description: 'validations error' })
    @Get('me')
    @Resource(UserResource)
    async me(@Request() req): Promise<User> {
        return req.user;
    }
}

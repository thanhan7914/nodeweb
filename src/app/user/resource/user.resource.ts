import { BaseResource } from 'src/core/resource/base.resource';
import { User } from '../dto/user.entity';
import { ExposeResource } from 'src/core/common.decorator';

export class UserResource extends BaseResource<User> {
    @ExposeResource()
    id: number;

    @ExposeResource()
    username: string;

    @ExposeResource()
    email: number;

    @ExposeResource()
    lastLoginAt: string;

    @ExposeResource()
    isActive: boolean;

    @ExposeResource()
    timetreeToken: string;

    @ExposeResource()
    timetreeCalendar: string;

    @ExposeResource()
    createdAt: Date;

    @ExposeResource()
    updatedAt: Date;
}

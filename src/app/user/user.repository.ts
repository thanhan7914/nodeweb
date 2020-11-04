import { Repository, EntityRepository } from 'typeorm';
import { User } from './dto/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
}

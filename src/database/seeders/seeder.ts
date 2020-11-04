import { Injectable, Logger } from '@nestjs/common';
import { AdminSeederService } from './admin/admin.service';

@Injectable()
export class Seeder {
    constructor(
        private readonly logger: Logger,
        private readonly adminSeederService: AdminSeederService,
    ) {}

    async seed() {
        await this.admins()
        .then(completed => {
            this.logger.debug('Successfuly completed seeding admins...');
            Promise.resolve(completed);
        })
        .catch(error => {
            this.logger.error('Failed seeding admins...');
            Promise.reject(error);
        });
    }

    async admins() {
        return await Promise.all(this.adminSeederService.create())
            .then(createdAdmin => {
                this.logger.debug('Admin created!');

                return Promise.resolve(true);
            })
            .catch(error => Promise.reject(error));
    }
}

import { Module, Logger } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { Seeder } from './seeder';
import { Config } from 'src/config/config.module';
import { AdminSeederModule } from './admin/admin.module';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
    imports: [Config, DatabaseModule, AdminSeederModule],
    providers: [Logger, Seeder],
})
export class SeederModule {}

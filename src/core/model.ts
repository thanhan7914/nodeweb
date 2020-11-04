import { Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseModel } from './base.model';

export class Model extends BaseModel {
    @Column({
        type: 'timestamp',
        default: null,
    })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: null,
    })
    updatedAt: Date;

    @BeforeInsert()
    beforeInsertListener() {
        this.updatedAt = new Date();
        this.createdAt = new Date();
    }

    @BeforeUpdate()
    beforeUpdateListener() {
        this.updatedAt = new Date();
    }
}

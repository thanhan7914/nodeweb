import * as crypto from 'crypto';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { User } from 'src/app/user/dto/user.entity';
import { PaginationMetadata } from 'src/core/resource/pagination.interface';

const moment = extendMoment(Moment);

export function passwordHash(password: string) {
    return crypto.createHmac('sha256', password).digest('hex');
}

export const alarmStatus = {
    notTake: 0,
    took: 1,
    suspend: 2,
};

export const takeMedicineType = {
    takeByApp: 0,
    editByApp: 1,
    openDevice: 2,
};

export const questionType = {
    howToUse: 0,
    appBug: 1,
    pillcaseBug: 2,
    other: 3,
};

export const questionStatus = {
    pending: 'pending',
    processing: 'processing',
    done: 'done',
};

export const REQUEST_HEADER = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
};

export const dateFormat = 'YYYY-MM-DD';
export const dateTimeFormat = 'YYYY-MM-DD HH:mm';

export function generateText(length: number = 8) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';

    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    return retVal;
}

export const openTime = '00:00:00';
export const closeTime = '23:59:00';
export const defaultTimezone = 'UTC';
export const tokyoTimezone = 'Asia/Tokyo';

export function tzConvert(time: moment.MomentInput, timezone: string = defaultTimezone): moment.Moment {
    // @ts-ignore
    return moment(time).tz(timezone);
}

export function toDatetimeString(time: moment.Moment, timezone: string = defaultTimezone): string {
    // @ts-ignore
    return time.clone().tz(timezone).format('YYYY-MM-DD HH:mm');
}

export function toDateString(time: moment.Moment, timezone: string = defaultTimezone): string {
    // @ts-ignore
    return time.clone().tz(timezone).format('YYYY-MM-DD');
}

export function toTimeString(time: moment.Moment, timezone: string = defaultTimezone): string {
    // @ts-ignore
    return time.clone().tz(timezone).format('HH:mm');
}

export function tzMoment(time: moment.MomentInput, timezone: string = defaultTimezone): moment.Moment {
    // @ts-ignore
    return moment.tz(time, timezone);
}

export function isTimezone(timezone: string): boolean {
    if (! timezone) { return false; }
    // @ts-ignore
    return !! moment.tz.zone(timezone);
}

export function tzRange(from: moment.MomentInput, to: moment.MomentInput, timezone: string = defaultTimezone) {
    const start = tzConvert(from, timezone);
    const end = tzConvert(to, timezone);
    return moment.range(start, end);
}

export interface RequestWithTimezone extends Request {
    timezone?: string;
    user?: User;
    paginationMetadata?: PaginationMetadata;
}

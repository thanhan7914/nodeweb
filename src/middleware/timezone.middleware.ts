import { Request } from 'express';
import { defaultTimezone, isTimezone } from 'src/helpers';

export function timezoneMiddleware(req: Request, res: Response, next: () => any) {
    let timezone: string = defaultTimezone;

    if (isTimezone(req.query.timezone as string)) {
        timezone = req.query.timezone as string;
    } else if (isTimezone(req.header('Time-Zone'))) {
        timezone = req.header('Time-Zone');
    }

    // assign timezone to request
    Object.assign(req, {
        timezone,
    });

    next();
}

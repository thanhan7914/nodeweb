import { passwordHash } from 'src/helpers';
import * as moment from 'moment';
import * as querystring from 'querystring';

export interface SignedOption {
    exp?: moment.MomentInput;
}

export class SignedUrl {
    static sign(url: string, option?: SignedOption) {
        const split = url.indexOf('?') === -1 ? '?' : '&';
        if (!option || !option.exp) {
            return `${url}${split}signed=${passwordHash(url)}`;
        }

        const exp = moment(option.exp).unix();
        url = `${url}${split}exp=${exp}`;

        return `${url}&signed=${passwordHash(url)}`;
    }

    static verify(url: string) {
        let lastAmpPos = url.lastIndexOf('&signed=');
        if (lastAmpPos === -1) {
            lastAmpPos = url.lastIndexOf('?signed=');
        }
        if (lastAmpPos === -1) {
            return false;
        }

        const signed = url.substring(lastAmpPos + 8);
        const data = querystring.parse(url.indexOf('?') === -1 ? url : url.substring(url.indexOf('?') + 1));

        if (signed !== passwordHash(url.substring(0, lastAmpPos))) {
            return false;
        }

        if (data.exp && moment(Number(data.exp + '000')).isBefore(Date.now())) {
            return false;
        }

        return true;
    }
}

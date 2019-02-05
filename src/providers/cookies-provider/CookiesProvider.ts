import { injectable } from 'inversify';

import Cookie from '../../interfaces/Cookie';

@injectable()
class CookiesProvider implements Cookie {

    private cookie: string;
    DEFAULT_COOKIE_PERIOD_DAYS: number;

    constructor() {
        this.cookie = document.cookie;
        this.DEFAULT_COOKIE_PERIOD_DAYS = 7;
    }

    get(name: string) {
        let matches = document.cookie.match(new RegExp(
            '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
        ));

        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    set(name: string, value: string, days?: number) {
        if (!days) {
            days = this.DEFAULT_COOKIE_PERIOD_DAYS;
        }

        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        let expires = '' + date.toUTCString();

        document.cookie = name + '=' + value + '; path=/; expires=' + expires;
    }

    delete(name: string) {
        this.set(name, '', -1);
    }
}

export default CookiesProvider;

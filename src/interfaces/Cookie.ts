interface Cookie {
    DEFAULT_COOKIE_PERIOD_DAYS: number;

    get(name: string);
    set(name: string, value: string, days?: number);
    delete(name: string);
}

export default Cookie;

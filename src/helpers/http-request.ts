import axios from 'axios';
import { REQUEST_HEADER } from './index';

export class HttpRequest {
    protected headers;
    protected apiUrl;
    protected readonly client;
    constructor() {
        this.headers = REQUEST_HEADER;
        this.apiUrl = '/api';
        this.client = axios;
    }

    get(path, params) {
        const requestUrl = this.apiUrl + path;
        const requestConfig = params ? { params, headers: this.headers } : { headers: this.headers };
        return this.client.get(requestUrl, requestConfig);
    }

    post(path, data) {
        const requestUrl = this.apiUrl + path;
        return this.client.post(requestUrl, data, { headers: this.headers });
    }

    put(path, data) {
        const requestUrl = this.apiUrl + path;
        return this.client.put(requestUrl, data, { headers: this.headers });
    }

    patch(path, data) {
        const requestUrl = this.apiUrl + path;
        return this.client.patch(requestUrl, data, { headers: this.headers });
    }

    delete(path, params) {
        const requestUrl = this.apiUrl + path;
        const requestConfig = params ? { params, headers: this.headers } : { headers: this.headers };
        return this.client.delete(requestUrl, requestConfig);
    }

    upload(path, data) {
        const requestUrl = this.apiUrl + path;
        const headers = { ...this.headers, 'Content-Type': 'multipart/form-data' };

        return this.client.post(requestUrl, data, { headers });
    }

    custom(config) {
        return this.client(config);
    }

    setHeaders(headers) {
        this.headers = Object.assign(this.headers, headers);
    }
}

import { RequestWithTimezone } from 'src/helpers';

export abstract class BaseResource<T> {
    /** entity */
    protected resource: T;
    /** request */
    protected request: RequestWithTimezone;

    /**
     * BaseResource constructor
     *
     * @param resource T
     * @param request Request
     */
    constructor(resource: T, request: Request) {
        this.resource = resource;
        this.request = request;
    }
}

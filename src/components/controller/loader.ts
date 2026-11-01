import { Endpoint, HttpStatus } from '../types/newsApi';

export type HttpMethod = 'GET' | 'POST';

export interface IApiOptions {
    apiKey: string;
}

export interface IQueryOptions {
    sources: string;
}

export type LoaderOptions = Readonly<IApiOptions>;
export type RequestOptions = Partial<IQueryOptions>;

export interface IRequestConfig {
    endpoint: Endpoint;
    options?: RequestOptions;
}

export type ResponseCallback<T> = (data: T) => void;

class Loader {
    private readonly baseLink: string;

    private readonly options: LoaderOptions;

    constructor(baseLink: string, options: LoaderOptions) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp<T>(
        { endpoint, options = {} }: IRequestConfig,
        callback: ResponseCallback<T> = (): void => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load<T>('GET', endpoint, callback, options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === HttpStatus.Unauthorized || res.status === HttpStatus.NotFound) {
                console.error(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            }

            throw new Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: RequestOptions, endpoint: Endpoint): string {
        const url = new URL(endpoint, this.baseLink);
        const urlOptions = { ...this.options, ...options };

        Object.entries(urlOptions).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.set(key, value);
            }
        });

        return url.toString();
    }

    private load<T>(
        method: HttpMethod,
        endpoint: Endpoint,
        callback: ResponseCallback<T>,
        options: RequestOptions = {}
    ): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then((res) => this.errorHandler(res))
            .then((res) => res.json() as Promise<T>)
            .then((data) => callback(data))
            .catch((err: unknown) => {
                if (err instanceof Error) {
                    console.error(err.message);
                } else {
                    console.error('An unexpected error occurred');
                }
            });
    }
}

export default Loader;

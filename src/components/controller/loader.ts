export type HttpMethod = 'GET' | 'POST';

export interface IRequestOptions {
    [key: string]: string | number | boolean | undefined;
}

export interface IRequestConfig {
    endpoint: string;
    options?: Partial<IRequestOptions>;
}

export type ResponseCallback<T> = (data: T) => void;

class Loader {
    private readonly baseLink: string;

    private readonly options: Readonly<IRequestOptions>;

    constructor(baseLink: string, options: IRequestOptions) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp<T>(
        { endpoint, options = {} }: IRequestConfig,
        callback: ResponseCallback<T> = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load<T>('GET', endpoint, callback, options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404) {
                console.error(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            }

            throw new Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: Partial<IRequestOptions>, endpoint: string): string {
        const url = new URL(endpoint, this.baseLink);
        const urlOptions = { ...this.options, ...options };

        Object.entries(urlOptions).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.set(key, String(value));
            }
        });

        return url.toString();
    }

    private load<T>(
        method: HttpMethod,
        endpoint: string,
        callback: ResponseCallback<T>,
        options: Partial<IRequestOptions> = {}
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

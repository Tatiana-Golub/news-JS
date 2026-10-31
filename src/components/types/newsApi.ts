export interface INewsSource {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export interface INewsArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

export enum NewsApiStatus {
    OK = 'ok',
    ERROR = 'error',
}

export interface INewsResponse {
    status: NewsApiStatus;
    totalResults: number;
    articles: INewsArticle[];
}

export interface ISourcesResponse {
    status: NewsApiStatus;
    sources: INewsSource[];
}

import News from './news/news';
import Sources from './sources/sources';
import { INewsResponse, ISourcesResponse } from '../types/newsApi';

export class AppView {
    private news: News;
    private sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: INewsResponse): void {
        this.news.draw(data.articles);
    }

    public drawSources(data: ISourcesResponse): void {
        this.sources.draw(data.sources);
    }
}

export default AppView;

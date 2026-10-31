import AppLoader from './appLoader';
import { INewsResponse, ISourcesResponse } from '../types/newsApi';

class AppController extends AppLoader {
    public getSources(callback: (data: ISourcesResponse) => void): void {
        super.getResp(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    public getNews(e: MouseEvent, callback: (data: INewsResponse) => void): void {
        const newsContainer = e.currentTarget;

        if (!(newsContainer instanceof HTMLElement)) {
            return;
        }

        if (!(e.target instanceof Element)) {
            return;
        }

        let target: Element = e.target;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');

                if (sourceId && newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);

                    super.getResp(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }

                return;
            }

            const parent: Element | null = target.parentElement;

            if (!parent) {
                return;
            }

            target = parent;
        }
    }
}

export default AppController;

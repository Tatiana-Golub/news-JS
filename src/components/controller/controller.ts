import AppLoader from './appLoader';
import { Endpoint, INewsResponse, ISourcesResponse } from '../types/newsApi';

class AppController extends AppLoader {
    public getSources(callback: (data: ISourcesResponse) => void): void {
        super.getResp<ISourcesResponse>({ endpoint: Endpoint.Sources }, callback);
    }

    public getNews(e: MouseEvent, callback: (data: INewsResponse) => void): void {
        const newsContainer = e.currentTarget;
        const ACTIVE_SOURCE_CLASS = 'source__item--active';

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

                    newsContainer.querySelector(`.${ACTIVE_SOURCE_CLASS}`)?.classList.remove(ACTIVE_SOURCE_CLASS);
                    target.classList.add(ACTIVE_SOURCE_CLASS);

                    super.getResp<INewsResponse>(
                        { endpoint: Endpoint.Everything, options: { sources: sourceId } },
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

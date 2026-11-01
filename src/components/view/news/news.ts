import './news.css';
import { NewsItem } from '../../types/newsApi';

export type NewsMessageKind = 'empty' | 'loading';

const MESSAGES: Readonly<Record<NewsMessageKind, string>> = {
    empty: 'No articles found for this source. Try another one.',
    loading: 'Loading news…',
};

function getElement<T extends Element>(parent: ParentNode, selector: string): T {
    const element = parent.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Element "${selector}" was not found`);
    }

    return element;
}

class News {
    public draw(data: readonly NewsItem[]): void {
        const newsContainer = getElement<HTMLElement>(document, '.news');

        if (data.length === 0) {
            this.showMessage('empty');
            return;
        }

        const news = data.slice(0, 10);

        const fragment = document.createDocumentFragment();
        const newsItemTemp = getElement<HTMLTemplateElement>(document, '#newsItemTemp');

        news.forEach((item, idx) => {
            const newsClone = newsItemTemp.content.cloneNode(true) as DocumentFragment;

            if (idx % 2) {
                getElement<HTMLElement>(newsClone, '.news__item').classList.add('alt');
            }

            getElement<HTMLElement>(newsClone, '.news__meta-photo').style.backgroundImage =
                `url(${item.urlToImage || 'img/news-placeholder.jpg'})`;

            getElement<HTMLElement>(newsClone, '.news__meta-author').textContent = item.author || item.source.name;

            getElement<HTMLElement>(newsClone, '.news__meta-date').textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');

            getElement<HTMLElement>(newsClone, '.news__description-title').textContent = item.title;
            getElement<HTMLElement>(newsClone, '.news__description-source').textContent = item.source.name;
            getElement<HTMLElement>(newsClone, '.news__description-content').textContent = item.description;
            getElement<HTMLAnchorElement>(newsClone, '.news__read-more a').setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        newsContainer.innerHTML = '';
        newsContainer.appendChild(fragment);
    }

    public showMessage(kind: NewsMessageKind): void {
        const newsContainer = getElement<HTMLElement>(document, '.news');
        const message = document.createElement('p');

        message.className = `news__message news__message--${kind}`;
        message.textContent = MESSAGES[kind];

        newsContainer.replaceChildren(message);
    }
}

export default News;

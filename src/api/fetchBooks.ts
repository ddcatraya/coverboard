import axios from 'axios';
import { CoverValues, ApiKey, LabelType, SearchResults } from 'types';

const GOOGLE_URL = 'https://www.googleapis.com';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

// Function to get the poster image of a movie
export const getBookCovers = async (
  bookTitles: Array<CoverValues>,
  apiKey: ApiKey,
): Promise<Array<SearchResults>> => {
  const posters = await Promise.allSettled(
    bookTitles.map((bookTitle) => {
      return axios.get(`${GOOGLE_URL}/books/v1/volumes`, {
        params: bookTitle[LabelType.SUBTITLE]
          ? {
              q: `intitle:${bookTitle}+inauthor:${
                bookTitle[LabelType.SUBTITLE]
              }`,
            }
          : {
              q: `intitle:${bookTitle[LabelType.TITLE]}`,
            },
      });
    }),
  );
  const fullPosters = posters.filter(isFulfilled);

  return fullPosters.flatMap((response: any) => {
    const { items } = response.value.data;
    if (items && items.length > 0 && items[0].volumeInfo.imageLinks) {
      return {
        link: items[0].volumeInfo.imageLinks.smallThumbnail,
        [LabelType.TITLE]: items[0].volumeInfo.title,
        [LabelType.SUBTITLE]: items[0].volumeInfo.authors.join(', '),
      };
    }

    return [];
  });
};

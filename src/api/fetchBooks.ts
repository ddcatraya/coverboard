import axios from 'axios';
import { CoverValues, ApiKey, LabelType, SearchResults } from 'types';

const GOOGLE_URL = 'https://www.googleapis.com';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

const fetchImageCover = async (isbm: string): Promise<string> => {
  try {
    const result: any = await axios.get(
      `https://www.librarything.com/services/rest/1.1/?method=librarything.ck.getwork&id=${isbm}&apikey=e0511ebe18b1788b0d78f3932f8482d1`,
    );

    return result['response']['ltml']['ltml'][0]['cover']['medium'];
  } catch (err) {
    return '';
  }
};

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

  const mappedPosers = fullPosters.flatMap((response: any) => {
    const { items } = response.value.data;
    if (items && items.length > 0 && items[0].volumeInfo.imageLinks) {
      const isbm = items[0].volumeInfo.industryIdentifiers.find(
        (identifier: any) => identifier.type === 'ISBN_13',
      )?.identifier;

      if (isbm) {
        return {
          isbm,
          [LabelType.TITLE]: items[0].volumeInfo.title,
          [LabelType.SUBTITLE]: items[0].volumeInfo.authors.join(', '),
        };
      }
    }

    return [];
  });

  const settledPosters = await Promise.allSettled(
    mappedPosers.map(({ isbm }: any) => {
      return axios.get(
        `https://www.librarything.com/services/rest/1.1/?method=librarything.ck.getwork&id=${isbm}&apikey=e0511ebe18b1788b0d78f3932f8482d1`,
      );
    }),
  );

  return settledPosters
    .map((result: any, index) => ({
      link: result?.value ?? '',
      [LabelType.TITLE]: mappedPosers[index][LabelType.TITLE],
      [LabelType.SUBTITLE]: mappedPosers[index][LabelType.SUBTITLE],
    }))
    .filter((res) => res.link);
};

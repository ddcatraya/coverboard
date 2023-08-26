import axios from 'axios';
import { CoverValues, LabelType, SearchResults } from 'types';

const GOOGLE_URL = 'https://www.googleapis.com';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

// Function to get the poster image of a movie
export const getBookCovers = async (
  bookTitles: Array<CoverValues>,
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
      return axios.get(`https://albumcoverboard.vercel.app/api/get-book`, {
        params: {
          isbm,
        },
      });
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

// https://yandex.ru/dev/speller/doc/dg/reference/checkTexts-docpage/
const yandexEndpoint =
  "https://speller.yandex.net/services/spellservice.json/checkTexts";

/**
 * code - error code
 *
 * pos - position of the word with an error (counting from 0)
 *
 * row - line number (counting from 0)
 *
 * col - column number (counting from 0)
 *
 * len - length of the misspelled word
 *
 * error - information about the error (there may be several or may be absent)
 *
 * word - the source word
 *
 * s - hint (may be several or may be absent)
 */
type YandexSpellingError = {
  code: number;
  pos: number;
  row: number;
  col: number;
  len: number;
  word: string;
  s: string[];
};

type YandexSpellingErrorsReturn = YandexSpellingError[][];

/**
 * Flat list of every spelling error with its corresponding `string` and `nodeId`.
 * There will likely be many array items with duplicate `nodeId`s, so make sure to search and edit the entire list.
 */
export type SpellingErrors = ({
  string: string;
  nodeId: string;
} & YandexSpellingError)[];

/**
 * Fetches spell check data from the yandex api.
 * @param strings
 * @returns Promise of the data - remember to unpack the return value/error in the calling function.
 */
export async function fetchSpellCheck(
  strings: string[]
): Promise<YandexSpellingErrorsReturn> {
  // A lot of trial and error went into figuring this out.
  // This Content-Type header is required to make the request work.
  const response = await fetch(yandexEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: textStringsToBodyData(strings),
  });

  return await response.json();
}

/** Create a `body` formatted in the way that Yandex expects */
function textStringsToBodyData(strings: string[]): string {
  const searchParams = new URLSearchParams();
  strings.forEach((string) => searchParams.append("text", string));
  return searchParams.toString();
}

export function augmentSpellingErrors(
  yandexErrorsArray: YandexSpellingErrorsReturn,
  strings: string[],
  nodeIds: string[]
): SpellingErrors {
  const spellingErrors: SpellingErrors = [];

  yandexErrorsArray.forEach((errors, index) => {
    errors.forEach((error, index2) => {
      const newError = {
        ...error,
        string: strings[index],
        nodeId: nodeIds[index2],
      };
      spellingErrors.push(newError);
    });
  });

  return spellingErrors;
}

// /**
//  * Find the index of the next error of a given `errors` array.
//  * @param errors
//  * @param afterIndex optional, by default does not skip any array items.
//  * @returns Returns the index of the first error after `afterIndex`, and -1 otherwise.
//  */
// export function findIndexOfNextError(
//   errors: SpellingErrors,
//   afterIndex: number = -1
// ): number {
//   // Skip over any errors before afterIndex.
//   // Using .findIndex() is nice because it handles empty array and end of array edge cases for you.
//   return errors.findIndex((_, index) => afterIndex >= index);
// }

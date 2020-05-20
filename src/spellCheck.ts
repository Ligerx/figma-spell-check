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
 * One spelling error with its corresponding `string` and `nodeId`.
 */
type SpellingError = {
  string: string;
  nodeId: string;
} & YandexSpellingError;

/**
 * Flat list of every spelling error with its corresponding `string` and `nodeId`.
 * There will likely be many array items with duplicate `nodeId`s, so make sure to search and edit the entire list.
 */
export type SpellingErrors = SpellingError[];

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

function replaceErrorWithSuggestion(
  errors: SpellingErrors,
  index: number,
  suggestion: string
): SpellingErrors {
  const error = errors[index];
  const position = error.pos;
  const lengthDifference = error.len - suggestion.length;

  const newString = replaceBetween(
    position,
    position + error.len,
    error.string,
    suggestion
  );

  // todo how do you update things on the figma side?
  // maybe return a tuple with the updated errors plus the new string?
  // maybe also return the new index here as well?

  // track a new index?
  // remove the error from the array
  // update all other errors that point to the same nodeId so that their pos offset is correct.
  //    I think I can ignore row and col for now cause I'm not using them. Just leave a note in the type def.
  // also send over the updated string so figma backend can update
  //
  // on figma backend, you replace the existing string with the new string
  //    crap do I have to worry about preserving styling.......
  // in the UI, the interface is simply updated
}

function replaceBetween(start, end, string, replacement) {
  return string.substring(0, start) + replacement + string.substring(end);
}

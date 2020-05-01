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
export type SpellingErrors = Array<
  [
    {
      code: number;
      pos: number;
      row: number;
      col: number;
      len: number;
      word: string;
      s: string[];
    }
  ]
>;

/**
 * Fetches spell check data from the yandex api.
 * @param strings
 * @returns Promise of the data - remember to unpack the return value/error in the calling function.
 */
export async function fetchSpellCheck(
  strings: string[]
): Promise<SpellingErrors> {
  const url = createURLForStrings(strings).toString();

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

function createURLForStrings(strings: string[]) {
  const url = new URL(yandexEndpoint);

  strings.forEach(string => {
    url.searchParams.append("text", string);
  });

  return url;
}

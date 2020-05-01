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
export type SpellingErrors = {
  code: number;
  pos: number;
  row: number;
  col: number;
  len: number;
  word: string;
  s: string[];
}[][];

/**
 * Fetches spell check data from the yandex api.
 * @param strings
 * @returns Promise of the data - remember to unpack the return value/error in the calling function.
 */
export async function fetchSpellCheck(
  strings: string[]
): Promise<SpellingErrors> {
  // A lot of trial and error went into figuring this out.
  // This Content-Type header is required to make the request work.
  const response = await fetch(yandexEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: textStringsToBodyData(strings)
  });

  return await response.json();
}

/** Create a `body` formatted in the way that Yandex expects */
function textStringsToBodyData(strings: string[]): string {
  const searchParams = new URLSearchParams();
  strings.forEach(string => searchParams.append("text", string));
  return searchParams.toString();
}

async function testSpellChecker() {
  try {
    const response = await fetch(
      "https://speller.yandex.net/services/spellservice.json/checkTexts?text=boook&text=finis"
    );
    const data = await response.json();
    console.log(data);
    console.log("inside the try");
  } catch (error) {
    console.error(error);
  }
}

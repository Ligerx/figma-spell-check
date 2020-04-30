import * as React from "react";
import "../styles/ui.css";

const App = ({}) => {
  // React.useEffect(() => {
  //     // This is how we read messages sent from the plugin controller
  //     window.onmessage = (event) => {
  //         const { type, message } = event.data.pluginMessage;
  //         if (type === 'create-rectangles') {
  //             console.log(`Figma Says: ${message}`);
  //         };
  //     }
  // }, []);

  React.useEffect(() => {
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

    testSpellChecker();
  }, []);

  return <div></div>;
};

export default App;

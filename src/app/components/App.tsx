import * as React from "react";
import "../styles/ui.css";
import { fetchSpellCheck } from "../../spellCheck";

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
    async function blook() {
      try {
        const blah = await fetchSpellCheck(["blook"]);
        console.log(blah);
      } catch (error) {
        console.log("caught error in app", error);
      }
    }
    blook();
  }, []);

  return <div></div>;
};

export default App;

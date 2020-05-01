import * as React from "react";
import "../styles/ui.css";
import { fetchSpellCheck } from "../../spellCheck";

const App = ({}) => {
  React.useEffect(() => {
    window.onmessage = async event => {
      const { type, payload } = event.data.pluginMessage;
      if (type === "fetchSpellCheck") {
        try {
          const spellingErrors = await fetchSpellCheck(payload as string[]);
          parent.postMessage(
            {
              pluginMessage: {
                type: "fetchSpellCheckSuccess",
                payload: spellingErrors
              }
            },
            "*"
          );
        } catch (error) {
          figma.notify("Failed to connect to spell check server.");
          console.error(error);
        }
      }
    };
  }, []);

  return <div></div>;
};

export default App;

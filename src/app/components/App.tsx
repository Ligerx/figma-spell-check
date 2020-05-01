import * as React from "react";
import "../styles/ui.css";
import { SpellingErrors, fetchSpellCheck } from "../../spellCheck";

const App = ({}) => {
  // textNodeIds and spellingErrors should have matching indices
  // eg. spellingErrors[0] should refer to textNodeIds[0]
  const [textNodeIds, setTextNodeIds] = React.useState<string[]>([]);
  const [spellingErrors, setSpellingErrors] = React.useState<SpellingErrors>(
    []
  );

  React.useEffect(() => {
    window.onmessage = async (event) => {
      const { type, payload } = event.data.pluginMessage;

      if (type === "fetchSpellCheck") {
        const { strings, nodeIds } = payload as {
          strings: string[];
          nodeIds: string[];
        };

        try {
          const spellingErrors = await fetchSpellCheck(strings);
          setSpellingErrors(spellingErrors);
          setTextNodeIds(nodeIds);
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

import * as React from "react";
import "../styles/ui.css";
import "figma-plugin-ds/dist/figma-plugin-ds.css";
import {
  fetchSpellCheck,
  augmentSpellingErrors,
  SpellingErrors,
} from "../../spellCheck";
import { IconButton } from "./IconButton";

const App = ({}) => {
  const [spellingErrors, setSpellingErrors] = React.useState<SpellingErrors>(
    []
  );
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    window.onmessage = async (event) => {
      const { type, payload } = event.data.pluginMessage;

      if (type === "fetchSpellCheck") {
        const { strings, nodeIds } = payload as {
          strings: string[];
          nodeIds: string[];
        };

        try {
          setIsLoading(true); // unsure if this needs await in front of it to work as expected
          const spellingErrors = await fetchSpellCheck(strings);
          const spellingErrorsWithNodeIds = augmentSpellingErrors(
            spellingErrors,
            strings,
            nodeIds
          );
          setSpellingErrors(spellingErrorsWithNodeIds);
          setCurrentIndex(0);
          setIsLoading(false);
        } catch (error) {
          figma.notify("Failed to connect to spell check server.");
          console.error(error);
        }
      }
    };
  }, []);

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex - 1);
    // todo focus correct text element
  };

  const handleNextClick = () => {
    setCurrentIndex(currentIndex + 1);
    // todo focus correct text element
  };

  const handleSuggestionClick = (suggestion: string) => () => {
    console.log();
    //
  };

  const error = spellingErrors[currentIndex];

  if (isLoading) {
    return <div>Checking your file...</div>;
  }

  if (spellingErrors.length === 0) {
    return <div>Document looks good.</div>;
  }

  return (
    <div>
      <div className="button-group arrow-button-group">
        <IconButton
          iconName={"icon--back"}
          disabled={currentIndex <= 0}
          onClick={handlePrevClick}
        />
        <IconButton
          iconName={"icon--forward"}
          disabled={currentIndex >= spellingErrors.length - 1}
          onClick={handleNextClick}
        />
      </div>
      <div className="type">
        Change <strong>{error.word}</strong> to:
      </div>

      {error.s.map((suggestion) => (
        <button
          className="button button--secondary"
          onClick={handleSuggestionClick(suggestion)}
        >
          {suggestion}
        </button>
      ))}

      <IconButton iconName={"icon--swap"} onClick={() => {}} />
    </div>
  );
};

export default App;

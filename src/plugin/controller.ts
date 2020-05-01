figma.showUI(__html__);

init();

function init() {
  setupMessageListeners();

  figma.ui.postMessage({
    type: "fetchSpellCheck",
    payload: findAllTextStrings()
  });
}

function setupMessageListeners() {
  figma.ui.onmessage = message => {
    const { type, payload } = message;

    if (type === "fetchSpellCheckSuccess") {
      // TODO
      console.log("got this from the UI", payload);
    } else if (type === "zoomToNode") {
      const { nodeId }: { nodeId: string } = payload;

      const node = figma.root.findOne(node => node.id === nodeId);
      figma.viewport.scrollAndZoomIntoView([node]);
    } else if (type === "replaceText") {
      const { nodeId, text }: { nodeId: string; text: string } = payload;

      const node = figma.root.findOne(node => node.id === nodeId) as TextNode;
      node.characters = text;
    }
  };
}

function findAllTextStrings(): string[] {
  const textNodes = figma.root.findAll(
    node => node.type === "TEXT"
  ) as TextNode[];

  return textNodes.map(textNode => textNode.characters);
}

// figma.closePlugin();

figma.showUI(__html__);

init();

function init() {
  setupMessageListeners();

  figma.ui.postMessage({
    type: "fetchSpellCheck",
    payload: findAllTextStringsAndIds()
  });
}

function setupMessageListeners() {
  figma.ui.onmessage = message => {
    const { type, payload } = message;

    if (type === "zoomToNode") {
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

function findAllTextStringsAndIds(): { strings: string[]; nodeIds: string[] } {
  const textNodes = figma.root.findAll(
    node => node.type === "TEXT"
  ) as TextNode[];

  const nodeIds = textNodes.map(node => node.id);
  const strings = textNodes.map(textNode => textNode.characters);

  return { strings, nodeIds };
}

// figma.closePlugin();

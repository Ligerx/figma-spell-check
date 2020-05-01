// figma.showUI(__html__);

// figma.ui.onmessage = (msg) => {
//     if (msg.type === 'create-rectangles') {
//         const nodes = [];

//         for (let i = 0; i < msg.count; i++) {
//             const rect = figma.createRectangle();
//             rect.x = i * 150;
//             rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//             figma.currentPage.appendChild(rect);
//             nodes.push(rect);
//         }

//         figma.currentPage.selection = nodes;
//         figma.viewport.scrollAndZoomIntoView(nodes);

//         // This is how figma responds back to the ui
//         figma.ui.postMessage({
//             type: 'create-rectangles',
//             message: `Created ${msg.count} Rectangles`,
//         });
//     }

//     figma.closePlugin();
// };

figma.showUI(__html__);

function init() {
  const textNodes = figma.root.findAll(
    node => node.type === "TEXT"
  ) as TextNode[];
  const textStrings = textNodes.map(textNode => textNode.characters);

  figma.ui.postMessage({ type: "fetchSpellCheck", payload: textStrings });

  figma.ui.onmessage = message => {
    const { type, payload } = message;

    if (type === "fetchSpellCheckSuccess") {
      console.log("got this from the UI", payload);
    }
  };
}

init();

// figma.closePlugin();

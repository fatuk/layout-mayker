// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(500, 500);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.



figma.ui.onmessage = (msg) => {
  if (msg.type === 'test') {
    const selection = figma.currentPage.selection[0] as FrameNode;

    // figma.ui.postMessage({ pluginMessage: { type: 'show-code', code: 'my code is here' } });
    const myCode = `
<Layout gap="8">
  <Typography>My text</Typography>
  <Typography>My text2</Typography>
</Layout>
    `;
    const testCode = createLayout(selection);
    // figma.ui.postMessage(testCode);
    console.log(testCode);
    
  }
  
}

function createLayout(node: FrameNode, parent = '') {
  let layoutProps = '';

  if (!node) {
    return 'Please select node';
  }

  if (node.name === 'Input') {
    return '[Input]';
  }

  if (isLayout(node) && node.layoutMode === 'VERTICAL') {
    layoutProps = ` isColumn`;
  }

  if (node.children) {
    const content = node.children.reduce((acc, child) => {

      if (child.name === 'Input') {
        return `${acc}\n[Input]`;
      }
      
      if (isLayout(child)) {
        if (child.layoutMode === 'VERTICAL') {
          layoutProps = ` isColumn`;
        }
        
        return `${acc}\n${createLayout(child)}`;
      }

      return `${acc}\n${child.name}\n${createLayout(child)}`;
    }, '');

    const newParent = `<Layout${layoutProps}>${content}\n</Layout>`;

    return newParent;
  }
}

function isLayout(node: FrameNode) {
  return Boolean(node.layoutMode);
}



/*
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  console.log(123);
  
  if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
*/
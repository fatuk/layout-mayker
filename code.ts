// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 100, height: 100, title: 'Layout maker' });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

figma.ui.onmessage = (msg) => {
  if (msg.type === 'test') {
    const selection = figma.currentPage.selection[0] as FrameNode;

    // figma.ui.postMessage({ pluginMessage: { type: 'show-code', code: 'my code is here' } });
    const testCode = createLayout(selection);
    // prettier.format(testCode)
    // figma.ui.postMessage(testCode);
    console.log(testCode);

  }

}

function createLayout(node: SceneNode, parent = ''): string | undefined {
  let layoutProps = '';

  if (!node) {
    return 'Please select node';
  }

  if (!node.visible) {
    return ''
  }

  if (node.type !== 'FRAME' && node.type !== 'INSTANCE' && node.type !== 'TEXT') {
    return '';
  }

  if (node.name === 'CUSTOM') {
    return '[My awesome component]';
  }

  if (node.name === 'Input') {
    return '[Input]';
  }

  if (node.name === 'Select') {
    return '[Select]';
  }

  if (node.name === 'Icon') {
    return '[Icon]';
  }

  if (node.name === 'Textarea') {
    return '[Textarea]';
  }

  if (node.name === 'Button') {
    return '[Button]';
  }

  if (node.type === 'TEXT') {
    return '[Typography]';
  }

  if (node.children) {
    const content = node.children.reduce((acc, child) => {
      return `${acc}\n${createLayout(child as FrameNode)}`;
    }, '');

    const newParent = `<Layout${getLayoutProps(node)}>${content}\n</Layout>`;

    return newParent;
  }
}

function getLayoutProps(node: FrameNode | InstanceNode) {
  let layoutProps = '';

  if (node.layoutMode === 'VERTICAL') {
    layoutProps = ` isColumn`;
  }

  if (node.itemSpacing > 0) {
    layoutProps += ` gap="${node.itemSpacing}"`;
  }

  if (node.paddingTop > 0) {
    layoutProps += ` paddingTop="${node.paddingTop}"`;
  }

  if (node.paddingRight > 0) {
    layoutProps += ` paddingRight="${node.paddingRight}"`;
  }

  if (node.paddingBottom > 0) {
    layoutProps += ` paddingBottom="${node.paddingBottom}"`;
  }

  if (node.paddingLeft > 0) {
    layoutProps += ` paddingLeft="${node.paddingLeft}"`;
  }

  return layoutProps;
}

function isLayout(node: FrameNode | InstanceNode) {
  return Boolean(node.layoutMode);
}

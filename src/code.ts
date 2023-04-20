figma.showUI(__html__, { width: 500, height: 400, title: 'Layout mayker' });

figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection[0] as FrameNode;
  const testCode = createLayout(selection);

  figma.ui.postMessage(testCode);
});

function createLayout(node: SceneNode): string | undefined {
  if (!node || !node.visible) {
    return '';
  }

  if (node.type !== 'FRAME' && node.type !== 'INSTANCE' && node.type !== 'TEXT') {
    return '';
  }

  if (node.name === 'CUSTOM') {
    return '[My awesome component]';
  }

  if (isInput(node)) {
    return '[Input]';
  }

  if (isSelect(node)) {
    return '[Select]';
  }

  if (node.name === 'Icon') {
    return '[Icon]';
  }

  if (isTextArea(node)) {
    return '[Textarea]';
  }

  if (isPrimaryButton(node)) {
    return '[Primary Button]';
  }

  if (isSecondaryButton(node)) {
    return '[Secondary Button]';
  }

  if (isTetriaryButton(node)) {
    return '[Tertiary Button]';
  }

  if (isToggle(node)) {
    return '[Toggle]';
  }

  if (isSkeleton(node)) {
    return '[Skeleton]';
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

  if (node.layoutGrow === 1) {
    layoutProps += ` isWide`;
  }

  if (node.itemSpacing > 0) {
    layoutProps += ` gap="${node.itemSpacing}"`;
  }

  if (node.paddingTop > 0 || node.paddingRight > 0 || node.paddingBottom > 0 || node.paddingLeft > 0) {
    layoutProps += ` padding="${node.paddingTop} ${node.paddingRight} ${node.paddingBottom} ${node.paddingLeft}"`;
  }

  if (node.primaryAxisAlignItems === 'MIN' && node.counterAxisAlignItems === 'MIN') {
    layoutProps += ` align="top-left"`;
  }

  if (node.primaryAxisAlignItems === 'CENTER' && node.counterAxisAlignItems === 'MIN') {
    layoutProps += ` align="middle-left"`;
  }

  if (node.primaryAxisAlignItems === 'MAX' && node.counterAxisAlignItems === 'MIN') {
    layoutProps += ` align="bottom-left"`;
  }

  if (node.primaryAxisAlignItems === 'MIN' && node.counterAxisAlignItems === 'CENTER') {
    layoutProps += ` align="top-center"`;
  }

  if (node.primaryAxisAlignItems === 'CENTER' && node.counterAxisAlignItems === 'CENTER') {
    layoutProps += ` align="middle-center"`;
  }

  if (node.primaryAxisAlignItems === 'MAX' && node.counterAxisAlignItems === 'CENTER') {
    layoutProps += ` align="bottom-center"`;
  }

  if (node.primaryAxisAlignItems === 'MIN' && node.counterAxisAlignItems === 'MAX') {
    layoutProps += ` align="top-right"`;
  }

  if (node.primaryAxisAlignItems === 'CENTER' && node.counterAxisAlignItems === 'MAX') {
    layoutProps += ` align="middle-right"`;
  }

  if (node.primaryAxisAlignItems === 'MAX' && node.counterAxisAlignItems === 'MAX') {
    layoutProps += ` align="bottom-right"`;
  }

  return layoutProps;
}

function isPrimaryButton(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'primary';
}

function isSecondaryButton(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'secondary';
}

function isTetriaryButton(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'tetriary';
}

function isInput(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'text field';
}

function isTextArea(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'text area';
}

function isSelect(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'selector';
}

function isToggle(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'toggle';
}

function isTypography(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'TEXT';
}

function isSkeleton(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'Base / Skeleton';
}

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
  let align = '';

  if (node.layoutMode === 'VERTICAL') {
    layoutProps = ` isColumn`;
    align = `${node.counterAxisAlignItems} ${node.primaryAxisAlignItems}`;
  } else {
    align = `${node.primaryAxisAlignItems} ${node.counterAxisAlignItems}`;
  }

  console.log(`align: ${align}`);

  if (node.layoutGrow === 1) {
    layoutProps += ` isWide`;
  }

  if (node.itemSpacing > 0) {
    layoutProps += ` gap="${node.itemSpacing}"`;
  }

  if (node.paddingTop > 0 || node.paddingRight > 0 || node.paddingBottom > 0 || node.paddingLeft > 0) {
    layoutProps += ` padding="${node.paddingTop} ${node.paddingRight} ${node.paddingBottom} ${node.paddingLeft}"`;
  }

  if (align === 'MIN MIN') {
    layoutProps += ` align="top-left"`;
  }

  if (align === 'MIN CENTER') {
    layoutProps += ` align="middle-left"`;
  }

  if (align === 'MIN MAX') {
    layoutProps += ` align="bottom-left"`;
  }

  if (align === 'CENTER MIN') {
    layoutProps += ` align="top-center"`;
  }

  if (align === 'CENTER CENTER') {
    layoutProps += ` align="middle-center"`;
  }

  if (align === 'CENTER MAX') {
    layoutProps += ` align="bottom-center"`;
  }

  if (align === 'MAX MIN') {
    layoutProps += ` align="top-right"`;
  }

  if (align === 'MAX CENTER') {
    layoutProps += ` align="middle-right"`;
  }

  if (align === 'MAX MAX') {
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

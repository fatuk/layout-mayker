figma.showUI(__html__, { width: 500, height: 400, title: 'Layout mayker' });

figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection[0];
  const testCode = createLayout(selection);

  figma.ui.postMessage(testCode);
});

function mapComponentProps(schemeObj: {}, componentProperties: ComponentProperties) {
  let result = '';
  // @ts-ignore-next-line
  let propsArr = Object.entries(componentProperties).map(( [k, v] ) => ({ ...v, id: k }));

  for (const k in schemeObj) {
    // @ts-ignore-next-line
    const prop = propsArr.find((_prop) => _prop.id.includes(schemeObj[k]));

    // @ts-ignore-next-line
    result += ` ${k}="${prop.value}"`;
  }

  return result;
}

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
    const scheme = {
      label: 'label text',
      placeholder: 'placeholder',
      size: 'size',
    };
    // @ts-ignore-next-line
    const props = mapComponentProps(scheme, node.componentProperties);

    return `<Input ${props} />`;
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

  if (isButton(node)) {
    const scheme = {
      color: 'color',
      variant: 'variant',
      size: 'size',
    };
    const a = node;
    const props = mapComponentProps(scheme, node.componentProperties);
    return `<Button ${props}>Button</Button>`;
  }

  if (isToggle(node)) {
    return '[Toggle]';
  }

  if (isSkeleton(node)) {
    return '[Skeleton]';
  }

  if (node.type === 'TEXT') {
    const styleId = node.textStyleId;
    // @ts-ignore-next-line
    const styleName = figma.getStyleById(styleId)?.name.split('/')[1];
    // @ts-ignore-next-line
    const colorId = node.fills[0].boundVariables.color.id;
    // @ts-ignore-next-line
    const colorName = `colors-${figma.variables.getVariableById(colorId)?.name.replaceAll('/', '-')}`;

    return `<Typography variant="${styleName}" color="${colorName}">${node.name}</Typography>`;
  }

  if (node.children) {
    const content = node.children.reduce((acc, child) => {
      return `${acc}\n${createLayout(child)}`;
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

function getInputProps(node: InstanceNode) {
  let inputProps = '';

  if (node.layoutMode === 'VERTICAL') {
    inputProps = ` isColumn`;
  }

  if (node.layoutGrow === 1) {
    inputProps += ` isWide`;
  }

  if (node.itemSpacing > 0) {
    inputProps += ` gap="${node.itemSpacing}"`;
  }

  if (node.paddingTop > 0 || node.paddingRight > 0 || node.paddingBottom > 0 || node.paddingLeft > 0) {
    inputProps += ` padding="${node.paddingTop} ${node.paddingRight} ${node.paddingBottom} ${node.paddingLeft}"`;
  }

  return inputProps;
}

function isButton(node: SceneNode): node is InstanceNode {
  const sceneNode = node as InstanceNode;

  return sceneNode.type === 'INSTANCE' && sceneNode.mainComponent?.parent?.name === 'button';
}

function isIconButton(node: FrameNode | InstanceNode | TextNode) {
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'icon-button';
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
  return node.type === 'INSTANCE' && node.mainComponent?.parent?.name === 'input';
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

function renderInput(node: InstanceNode) {
  return `<Input${getInputProps(node)} />`;
}

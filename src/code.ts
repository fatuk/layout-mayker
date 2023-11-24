figma.showUI(__html__, { width: 500, height: 400, title: 'Layout mayker' });

figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection[0];
  const testCode = createLayout(selection);

  figma.ui.postMessage(testCode);
});

type Scheme = {
  [key: string]: string;
};

function mapComponentProps(schemeObj: Scheme, componentProperties: ComponentProperties) {
  let result = '';
  let propsArr = Object.entries(componentProperties).map(( [k, v] ) => ({ ...v, id: k }));

  for (const k in schemeObj) {
    const prop = propsArr.find((_prop) => _prop.id.includes(schemeObj[k]));
    if (prop) {
      result += ` ${k}="${prop.value}"`;
    }
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

  if (isInstance(node)) {
    if (is('button', node)) {
      const scheme = {
        color: 'color',
        variant: 'variant',
        size: 'size',
      };
      const props = mapComponentProps(scheme, node.componentProperties);
      return `<Button ${props}>Button</Button>`;
    }

    if (is('input', node)) {
      const scheme = {
        label: 'label text',
        placeholder: 'placeholder',
        size: 'size',
      };
      const props = mapComponentProps(scheme, node.componentProperties);

      return `<Input ${props} />`;
    }

    if (is('select', node)) {
      return '[Select]';
    }

    if (is('icon', node)) {
      return '[Icon]';
    }

    if (is('text area', node)) {
      return '[Textarea]';
    }

    if (is('toggle', node)) {
      const scheme = {
        isChecked: 'On / Off',
        label: 'placeholder',
      };
      const props = mapComponentProps(scheme, node.componentProperties);

      console.log(node);


      return `<Toggle ${props} />`;
    }

    if (is('Base / Skeleton', node)) {
      return '[Skeleton]';
    }
  }

  if (isText(node)) {
    const styleId = node.textStyleId as string;
    const styleName = figma.getStyleById(styleId)?.name.split('/')[1];
    const fills = node.fills as SolidPaint[];
    const colorId = fills[0].boundVariables?.color?.id;
    let colorName = 'no color';

    if (colorId) {
      colorName = `colors-${figma.variables.getVariableById(colorId)?.name.replaceAll('/', '-')}`;
    }

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

function isInstance(node: SceneNode): node is InstanceNode {
  return node.type === 'INSTANCE';
}

function isText(node: SceneNode): node is TextNode {
  return node.type === 'TEXT';
}

function is(componentName: string, node: InstanceNode){
  return node.mainComponent?.parent?.name === componentName;
}

# create-chakraicon
> transform SVG asset to be React Chakra-UI Icon

### CLI
## Usage (CLI)


```console
npx create-chakraicon -n "MyIcon" -i ./myicon.svg -o ./MyIcon.js
```

### Options
* `-n/--name`:  it will be `displayName` in Component Properties.
* `-i/--input`:  where your put the `SVG` file.
* `-o/--output`: where your want to save your file.

### Pipe (stdout)
```console
$> echo "
<svg viewBox=\"0 0 200 200\">
    <path
      fill=\"#666\"
      d=\"M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0\"
    />
  </svg>
" | create-chakraicon -n "Rin"
// output
import { createIcon } from "@chakra-ui/react";
export const Rin = createIcon({
  displayName: "Rin",
  viewBox: "0 0 200 200",
  d: "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
});
```

### Pipe (output file)
```console
$> echo "
<svg viewBox=\"0 0 200 200\">
    <path
      fill=\"#666\"
      d=\"M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0\"
    />
  </svg>
" | create-chakraicon -n "Rin" > RinIcon.js 
```

## Usage (API)

```js
import { api } from 'create-chakraicon'
// or
import api from 'create-chakraicon/api'
// exported function
api {
  createChakraProperties: [Function: createChakraProperties],
  createChakraFunctional: [Function: createChakraFunctional],
  importChakraIcon: [Function: importChakraIcon],
  createSourceChakraIcon: [Function: createSourceChakraIcon],
  hastSVGToChakraProperties: [Function: hastSVGToChakraProperties]
}

```

<!--TYPEDEFS-->
## Typedefs

<dl>
<dt><a href="#PropsChakraProperties">PropsChakraProperties</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#PropsChakraFunctional">PropsChakraFunctional</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#SvgProperties">SvgProperties</a> ⇒ <code>Object</code></dt>
<dd><p>example of @param</p>
<pre><code class="language-js">{
    type: &#39;root&#39;,
    children: [
      {
        type: &#39;element&#39;,
        tagName: &#39;svg&#39;,
        properties: { viewBox: &#39;0 0 200 200&#39; },
        children: [ [Object], [length]: 1 ],
        metadata: &#39;\n  &#39;
      },
      [length]: 1
    ]
  }
}
</code></pre>
</dd>
</dl>

<a name="PropsChakraProperties"></a>

## PropsChakraProperties ⇒ <code>Object</code>
**Kind**: global typedef  
**Returns**: <code>Object</code> - t.ObjectExpression  
**See**: {https://babeljs.io/docs/en/babel-types#objectexpression}  
**Properties**

| Name | Type |
| --- | --- |
| displayName | <code>String</code> | 
| viewBox | <code>String</code> | 
| [path] | <code>String</code> | 
| [d] | <code>String</code> | 

<a name="PropsChakraFunctional"></a>

## PropsChakraFunctional ⇒ <code>Object</code>
**Kind**: global typedef  
**Returns**: <code>Object</code> - t.ExportNameDeclaration  
**See**

- {https://babeljs.io/docs/en/babel-types#objectexpression}
- {https://babeljs.io/docs/en/babel-types#exportnameddeclaration}

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| displayName | <code>String</code> | Will make as Identifier of your export function name |
| objectExpression | <code>Object</code> | BabelAST for Object Properties Chakra Icon |

<a name="SvgProperties"></a>

## SvgProperties ⇒ <code>Object</code>
example of @param
```js
{
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'svg',
        properties: { viewBox: '0 0 200 200' },
        children: [ [Object], [length]: 1 ],
        metadata: '\n  '
      },
      [length]: 1
    ]
  }
}
```

**Kind**: global typedef  
**Returns**: <code>Object</code> - SvgProperties  

| Param | Type | Description |
| --- | --- | --- |
| SVG | <code>Object</code> | HAST |

**Properties**

| Name | Type |
| --- | --- |
| d | <code>String</code> | 
| viewBox | <code>String</code> | 

<!--END TYPEDEFS-->

## Alternative
* [**SVGR**](https://react-svgr.com/)
* [**create-chakra-icon**](https://www.npmjs.com/package/create-chakra-icon)
   
## License
[See HERE](./LICENSE)

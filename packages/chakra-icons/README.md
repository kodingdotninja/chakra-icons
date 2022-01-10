## TODO
> WORK IN PROGRESS

* [x] `create-index` in `dist` before Publish  
* [ ] CI Publish in NPM 
* [ ] Web Documentation (Inspire by [react-icons](https://react-icons.github.io/react-icons/))

<p align="center">
  
  Collections React Icons with Chakra-UI ⚡️ (Ready to Use)

</p>

## How To
### Installation
```console
yarn add chakra-icons
```
**OR use NPM**

```console
npm install --save-dev chakra-icons
```

### Usage

```jsx
import { IconName } from 'chakra-icons'

const App = () => (
  <div>
    <IconName boxSize="md" color="blue" />
  </div>
)
```

You just need to change `IconName` with the specific icon name that we are provided, See [List Available Icons](#).

## Contribution

* Feel free for make an issue, pull requests, and contact us if you have any question.
* Add new `Icons`
  * Fork this repository.
  * Modify `icons.yml` with add new public repository and path of svg files.
  * run `yarn generate` after changes and see the output changes in `dist/`.
  * when you think is correct well, send a new pull requests.

## License
```console
This project stand with MIT License but every icons have license such a CC or MIT.
```

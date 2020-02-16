# Vue Virtual DOM Diff Algorithm

## An example

| Element | Children (li type, optional key) |
| ------- | -------------------------------- |
| old ul  | A(a) B C(c) D                    |
| new ul  | B1 A1(a) G(g) F E C1(c)          |

| Patch / Insert | DOM after patch / insert |
| -------------- | ------------------------ |
| B1 -> D        | B1 A(a) B C(c)           |
| A1 -> A        | B1 A1(a) B C(c)          |
| C1 -> C        | B1 A1(a) B C1(c)         |
| E -> B         | B1 A1(a) E C1(c)         |
| G +            | B1 A1(a) G(g) E C1(c)    |
| F +            | B1 A1(a) G(g) F E C1(c)  |

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn dev
```

### Compiles and minifies for production

```
yarn build
```

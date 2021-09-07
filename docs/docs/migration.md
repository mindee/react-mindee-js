---
sidebar_position: 5
---

# Migration from v1.2 to v1.3

> Version 1.3 API becomes simpler. Here is the changes :

| Version 1.2                         |                 Version 1.3                 | description                                                                                                                                                                                                   |
| :---------------------------------- | :-----------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image`, `orientation` and `shapes` | `data` : {`image`, `orientation`, `shapes`} | The 3 main props has been placed inside **data** props to keep the canvas state consistent between outer state changes. This update was necessary to avoid some performance issues noticed on some use cases. |
| `styles`                            |                   `style`                   |                                                                                                                                                                                                               |

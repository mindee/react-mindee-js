# Settings

Many components or helpers can accept a `settings` object as an input.

It is a set of settings that you can tweak to your needs.

There are some top-level domain that leads to configuration object and some other generic:

* **COLORS**: colors used for document viewer
* **zoom**: default zoom, modifier speed, maximum
* **tweening**: tweening duration and interpolation method
* **effects**: this is maybe the most important settings since it acts as feature flag for the following:
    * zooming
    * dragging
    * resizing
    * positionTracking
    * hovering
    * tweening
* **debug**: this is used to toggle display of debug information and trigger `useTrace` output.

Let's say you want to disable zooming and tweening and set background color red:

```javascript
const settings = {
    COLORS: {
        BACKGROUND: "#ff0000"
    },
    effects: {
        zooming: false,
        tweening: false
    }
}
```

All others settings fallback to their default.
See `src/helpers/canvas/settings.js` for all available values.

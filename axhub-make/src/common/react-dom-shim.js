const RD = window.ReactDOM || {};

if (!window.ReactDOM) {
  console.error('[react-dom-shim] window.ReactDOM is not available. Ensure ReactDOM is loaded via CDN or external script before this module.');
}

export default window.ReactDOM;

export const {
  createRoot,
  hydrateRoot,

  render,
  hydrate,
  unmountComponentAtNode,
  findDOMNode,

  createPortal,

  flushSync,
  unstable_batchedUpdates,
  unstable_renderSubtreeIntoContainer,
} = RD;
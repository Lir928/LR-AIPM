const R = window.React || {};
const RJSXRuntime = window.ReactJSXRuntime || {};

if (!window.React) {
  console.error('[react-shim] window.React is not available. Ensure React is loaded via CDN or external script before this module.');
}

export default window.React;

export const {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useDeferredValue,
  useTransition,
  useId,
  useSyncExternalStore,
  useInsertionEffect,

  forwardRef,
  memo,
  createElement,
  Fragment,
  Component,
  PureComponent,
  createContext,
  createRef,
  lazy,
  Suspense,
  StrictMode,
  Profiler,
  Children,
  cloneElement,
  isValidElement,
  createFactory,
  startTransition,
  act,
  version,
} = R;

export const jsx = RJSXRuntime.jsx || R.createElement;
export const jsxs = RJSXRuntime.jsxs || R.createElement;
export const jsxDEV = RJSXRuntime.jsxDEV || R.createElement;
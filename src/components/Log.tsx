import { useEffect, useRef } from "preact/hooks";

let el: HTMLPreElement;

export function log(...value) {
  el.innerText += value.join(' ');
}

export function Log() {
  const logEl = useRef<HTMLPreElement>();
  useEffect(() => {
    el = logEl.current;
  })
  return <pre ref={logEl}></pre>
}

import { MutableRef, useEffect, useRef } from "preact/hooks";
import { ChordChart } from "../project";
import { getMetadata, render } from "@anbcodes/chordpdf/lib";
import * as pdfjs from 'pdfjs-dist';

let canvases: HTMLCanvasElement[] = [];

const update = async (ref: MutableRef<HTMLDivElement>, chart: string, fontSize: number, key: string, downloadTag?: MutableRef<HTMLAnchorElement>) => {
  const pdf = render(chart, key, fontSize);
  if (downloadTag) {
    downloadTag.current.href = URL.createObjectURL(new Blob([pdf.output()], {
      type: 'application/pdf',
    }));
    downloadTag.current.download = `${getMetadata(chart).metadata.Title}.pdf`;
  }
  

  const pdfDoc = await pdfjs.getDocument(new TextEncoder().encode(pdf.output())).promise;

  const pageCount = pdf.getNumberOfPages();

  if (canvases.length > pageCount) {
    canvases.slice(pageCount).forEach(c => c.remove())
    canvases = canvases.slice(0, pageCount)
  }

  for (let i = 0; i < pageCount; i++) {
    if (!canvases[i]) {
      const el = document.createElement('canvas');
      el.style.maxWidth = '900px';
      el.style.width = '100%';
      ref.current.appendChild(el);
      canvases.push(el);
    }

    const page = await pdfDoc.getPage(i + 1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = canvases[i];
    // const scale = canvas.clientWidth / viewport.width;
    // const realViewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No context!")
    const renderTask = page.render({
      canvasContext: ctx,
      viewport,
    });
    await renderTask.promise;
  }
}


let isUpdating = false;
let updateRequired = false;
let updatePromise: Promise<void> = new Promise((resolve) => {resolve()});
async function queueUpdate(ref: MutableRef<HTMLDivElement>, chart: string, fontSize: number, key: string, downloadTag?: MutableRef<HTMLAnchorElement>) {
  if (updateRequired) {
    return;
  }

  if (isUpdating) {
    updateRequired = true;
    await updatePromise;
    updateRequired = false;
  }
  isUpdating = true;
  updatePromise = update(ref, chart, fontSize, key, downloadTag);
  await updatePromise;
  isUpdating = false;
}

export function ChordChartRenderer({chart, fontSize, key, downloadTag}: {chart: string, fontSize: number, key: string, downloadTag?: MutableRef<HTMLAnchorElement>}) {
  const pages = useRef<HTMLDivElement>();
  useEffect(() => {
    queueUpdate(pages, chart, fontSize, key, downloadTag);
  }, [pages, chart, fontSize, key, downloadTag])
  return <div ref={pages}></div>
}

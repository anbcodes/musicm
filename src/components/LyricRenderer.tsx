import { MutableRef, useEffect, useRef, useState } from "preact/hooks";
import { Project } from "../project";

export const parseLyrics = (lyrics: string) => {
  let sections = lyrics.split(/^#/gm).filter(v => v.trim()).map(v => ({
    name: v.split('\n')[0].trim(),
    slides: [...v.split('\n').slice(1).join('\n').split('\n\n').filter(v => v.trim()).map(v => v.trim())],
  })).map((v, i, a) => ({
    ...v,
    start: a.slice(0, i).reduce((t, v) => t + v.slides.length, 0),
  }));
  return sections;
}

const fadeTime = 150;

let current = {
  slide: [],
}

let goal = {
  slide: [],
  start: +new Date(),
}

let ctx: CanvasRenderingContext2D | undefined;
const render = () => {
  if (!ctx) return;

  ctx.canvas.width = ctx.canvas.clientWidth;
  ctx.canvas.height = ctx.canvas.width / 16 * 9;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.textAlign = 'center';

  const renderLines = (opacity: number, lines: string[]) => {
    // Current
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.font = `${ctx.canvas.height / 10}px sans-serif`;
    const lineHeight = ctx.canvas.height / 8;
    const startHeight = ctx.canvas.height / 2 - ((lines.length - 1) * lineHeight / 2);
    for (let i = 0; i < lines.length; i++) {
      let h = startHeight + i * lineHeight;
      ctx.fillText(lines[i], ctx.canvas.width / 2, h, ctx.canvas.width)
    }
  }

  const fadePercent = Math.min(Math.max((+new Date()-goal.start)/fadeTime, 0), 1);

  renderLines(1 - fadePercent, current.slide);
  renderLines(fadePercent, goal.slide);


  requestAnimationFrame(render)
}

const stopRender = () => {
  ctx = undefined;
}

const displayLine = (canvas: MutableRef<HTMLCanvasElement>, line: string) => {
  let octx = ctx;
  ctx = canvas.current.getContext('2d');

  current = goal;
  goal = {start: +new Date(), slide: line.split('\n')}

  if (!octx) {
    requestAnimationFrame(render)
  }
}

export function totalLength(lyrics: string) {
  return parseLyrics(lyrics).reduce((t, v) => t+v.slides.length, 0);
}

export function LyricRenderer({ project, lyric, location }: { project: Project, lyric: string, location: number }) {
  const lyrics = project.lyrics.find(v => v.id === lyric);
  const sections = parseLyrics(lyrics.content);
  const lineIndex = sections.findIndex(v => v.start > location);
  const section = sections.at(lineIndex === -1 ? -1 : lineIndex - 1);
  const line = section.slides[location - section.start];
  const canvas = useRef<HTMLCanvasElement>();
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (canvas.current)
      displayLine(canvas, line);
    return () => {
      stopRender();
    }
  }, [canvas, project, lyric, location])

  useEffect(() => {
    let eventL = (e) => {
      console.log(e.key)
      if (e.key === 'Escape') {
        setFullscreen(false)
      }
    };
    window.addEventListener('keydown', eventL)

    return () => {
      window.removeEventListener('keydown', eventL);
    }
  }, []);

  return <div class={'w-full flex items-center justify-center ' + (fullscreen ? 'fullscreen' : '')} onClick={() => setFullscreen(!fullscreen)}>
    <canvas class={"flex-grow " + (fullscreen ? '' : 'max-w-[400px] min-w-0')} ref={canvas}  />
  </div>

}

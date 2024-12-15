import { useEffect, useRef, useState } from "preact/hooks"
import { useProject } from "../project";
import { LyricRenderer, parseLyrics } from "../components/LyricRenderer";

export function SlideShowPresenter({pid, id}: {pid: string, id: string}) {
  const [project, setProject] = useProject(pid);
  if (!project) return false;
  const slideShow = project.slideShows.find(v => v.id === id);
  const [lyric, setLyric] = useState(slideShow.lyrics[0].id);
  const [loc, setLoc] = useState(0);
  const websocket = useRef<WebSocket>();

  const goToSlide = (lyric: string, loc: number) => {
    setLyric(lyric);
    setLoc(loc);
    const ws = websocket.current;
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'lyric',
        project: pid,
        slideShow: id,
        lyric,
        loc
      }));
    }
  }

  useEffect(() => {
    websocket.current = new WebSocket(`wss://ws.anb.codes/chan/mmproject-${pid}`);
    const ws = websocket.current;
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({project: pid}));
    });
    ws.addEventListener('message', (ev) => {
      console.log(ev.data)
      const json = JSON.parse(ev.data);
      if (json.type === 'lyric' && json.project === pid && json.slideShow === id) {
        setLyric(json.lyric);
        setLoc(json.loc);
      }
    })

    return () => ws.close();
  }, [pid])

  return (
    <>
    <div class="pt-[30px] flex flex-col max-w-[600px] m-auto text-black">
      <h1 class="text-center pb-4 text-4xl bg-white">{slideShow.title}</h1>

			<LyricRenderer project={project} lyric={lyric} location={loc}></LyricRenderer>

      <button onClick={() => goToSlide(lyric, -1)} class="fixed bottom-8 right-8 px-2 py-2 border shadow-sm rounded bg-white z-[5] hover:bg-gray-100 active:bg-gray-200">Blank</button>

      <a class="self-center text-blue-500 hover:underline" href={`../${slideShow.id}`}>Back</a>

      {
        slideShow.lyrics.map(l => project.lyrics.find(v => v.id === l.id)).map(l => ({...l, sections: parseLyrics(l.content)})).map((l, i) => (<details class="p-3 flex-col gap-9 [&_svg]:open:rotate-0">
          <summary class="p-3 flex items-center">
            <svg class="-rotate-90 mr-1 transform transition-all duration-300" fill="none" height="20" width="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <h1 class="text-center text-3xl bg-white mr-4">{l.title}</h1>
            <a href={`/p/${project.id}/l/${l.id}`}>
              <h2 class="text-blue-500 hover:underline">view</h2>
            </a>
          </summary>
          {l.sections.map(s => (<div class="pl-6">
              <h2 class="text-2xl">{s.name}</h2>
              <div class="flex gap-3 flex-wrap">
                {s.slides.map((slide, si) => (<button onClick={() => goToSlide(l.id, s.start + si)} class="my-2 pl-3 cursor-pointer shadow-md rounded p-2">
                  {slide.split('\n').map(t => (
                    <div>{t}</div>
                  ))}
                </button>))}
              </div>
            </div>))}
			</details>))}

    </div>
  </>
  )
  
}

import { useRef, useState } from "preact/hooks"
import { useProject } from "../project";

export function SlideShow({pid, id}: {pid: string, id: string}) {
  const [project, setProject] = useProject(pid);
  if (!project) return false;
  const slideShow = project.slideShows.find(v => v.id === id);
  const saveSlideShow = (_slideShow = slideShow) => {
    let slideShowI = project.slideShows.findIndex(v => v.id === id);
    if (slideShowI === -1) throw new Error("Slide show disappeared???");
    project.slideShows[slideShowI] = _slideShow;
    setProject({...project});
  }

  const addLyric = () => {
    slideShow.lyrics.push({
      id: project.lyrics[0].id,
    });
    saveSlideShow();
	}

  return (
    <>
    <div class="pt-[30px] flex flex-col max-w-[600px] m-auto text-black">
			<input
        value={slideShow.title}
        class="text-center pb-4 text-4xl bg-white"
        onInput={(e) => (slideShow.title = (e.target as HTMLInputElement).value,saveSlideShow())}
      ></input>

      <a class="self-center text-blue-500 hover:underline" href={`./${slideShow.id}/view`}>Present</a>

      {
        slideShow.lyrics.map((l, i) => (<div class="p-3 flex gap-9">
          <select value={l.id} onChange={(e) => (slideShow.lyrics[i].id = (e.target as HTMLSelectElement).value,saveSlideShow())} class="bg-white border rounded p-1">
            {project.lyrics.map(v => <option value={v.id}>{v.title}</option>)}
          </select>
          <a href={`/p/${project.id}/l/${l.id}`}>
            <h2 class="text-blue-500 hover:underline">view</h2>
          </a>
			</div>))}
			<button onClick={addLyric} class="p-2 px-10 mt-10 rounded shadow w-[300px] bg-blue-600 hover:bg-blue-700 text-white">Add Lyrics</button>

    </div>
  </>
  )
  
}
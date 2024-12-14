import { useEffect, useState } from "preact/hooks"
import { removeProject, saveProject, useProject } from "../project";
import { generateId } from "../util";
import { useLocation } from "preact-iso";
import { compressToEncodedURIComponent } from "lz-string";
import { RemoveConfirm } from "../components/RemoveConfirm";

const defaultChart = `
Key: C
Title: Example
Author: Example Author
BPM: 71

# Verse 1
1              4
  Some lines of a song
4                   5
Next line, and again
6m   2m
More chords
4   5       1
And finally

# Interlude
(1) / / / | / / / /`

export function Project({id}: {id: string}) {
  const [project, setProject] = useProject(id);
  const {route} = useLocation();

  const addChordCart = async () => {
		const id = generateId();
    project.chords.push({
      id,
      title: "New Chart",
      chart: defaultChart,
      fontSize: 13,
    });
    await saveProject(project);
		route(`/p/${project.id}/c/${id}`);
	}

  const addSetlist = async () => {
		const id = generateId();
    project.setlists.push({
      id,
      title: "New Setlist",
      chords: [],
    });
    await saveProject(project);
		route(`/p/${project.id}/s/${id}`);
	}

  const addLyric = async () => {
		const id = generateId();
    project.lyrics.push({
      id,
      title: "New Lyrics",
      content: "# Verse 1\nSome lines\nMore on same slide\n\nAnother slide\nIt's another slide",
    });
    await saveProject(project);
		route(`/p/${project.id}/l/${id}`);
	}

  const addSlideShow = async () => {
		const id = generateId();
    project.slideShows.push({
      id,
      title: "New SlideShow",
      lyrics: [],
    });
    await saveProject(project);
		route(`/p/${project.id}/ss/${id}`);
	}

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let tm: number;
    if (copied) {
      tm = window.setTimeout(() => setCopied(false), 1500);
    }
    return () => clearTimeout(tm);
  }, [copied])
  const copyLink = async () => {
    const data = compressToEncodedURIComponent(JSON.stringify(project));
    const link = `${location.origin}/import/${data}`;
    await navigator.clipboard.writeText(link);

    setCopied(true);
  }

  const remove = () => {
    removeProject(project);
    route('/');
  }

  return project && (
    <div class="pt-[30px] flex flex-col max-w-[500px] m-auto text-black">
			<input
        value={project.title}
        class="text-center text-4xl bg-white"
        onInput={(e) => (project.title = (e.target as HTMLInputElement).value,setProject(project))}
      ></input>
      <div class="flex justify-center pt-2 pb-4">
        <button onClick={copyLink} class="py-1.5 w-[190px] text-sm rounded shadow bg-blue-600 hover:bg-blue-700 text-white">{copied ? "Copied!" : "Copy Link (shares a copy)"}</button>
      </div>
      <h1 class="pb-4 pt-6 text-3xl">Chords</h1>
      {project.chords.map(c => (<div class="ml-2 p-3">
				<a href={`/p/${project.id}/c/${c.id}`}>
					<h2 class="text-2xl hover:underline">{c.title}</h2>
				</a>
			</div>))}
			<button onClick={addChordCart} class="ml-5 p-2 px-10 mt-10 rounded shadow w-[300px] bg-blue-600 hover:bg-blue-700 text-white">Add Chord Chart</button>
      
      <h1 class="pb-4 pt-6 text-3xl">Setlists</h1>
      {project.setlists.map(s => (<div class="ml-2 p-3">
				<a href={`/p/${project.id}/s/${s.id}`}>
					<h2 class="text-2xl hover:underline">{s.title}</h2>
				</a>
			</div>))}
			<button onClick={addSetlist} class="ml-5 p-2 px-10 mt-10 rounded shadow w-[300px] bg-blue-600 hover:bg-blue-700 text-white">Add Setlist</button>

      <h1 class="pb-4 pt-6 text-3xl">Lyrics</h1>
      {project.lyrics.map(l => (<div class="ml-2 p-3">
				<a href={`/p/${project.id}/l/${l.id}`}>
					<h2 class="text-2xl hover:underline">{l.title}</h2>
				</a>
			</div>))}
			<button onClick={addLyric} class="ml-5 p-2 px-10 mt-10 rounded shadow w-[300px] bg-blue-600 hover:bg-blue-700 text-white">Add Lyric</button>

      <h1 class="pb-4 pt-6 text-3xl">Slide Shows</h1>
      {project.slideShows.map(s => (<div class="ml-2 p-3">
				<a href={`/p/${project.id}/ss/${s.id}`}>
					<h2 class="text-2xl hover:underline">{s.title}</h2>
				</a>
			</div>))}
			<button onClick={addSlideShow} class="ml-5 p-2 px-10 mt-10 rounded shadow w-[300px] bg-blue-600 hover:bg-blue-700 text-white">Add Slide Show</button>

      <RemoveConfirm onClick={remove} className="ml-5 p-2 px-10 mt-10 w-[300px]">Remove Project</RemoveConfirm>
    </div>
  )
  
}

import { decompressFromEncodedURIComponent } from "lz-string"
import { Project, saveProject, useProjects } from "../project";
import { useLocation } from "preact-iso";

export function Import({enc}: {enc: string}) {
  let project: Project;
  try {
    project = JSON.parse(decompressFromEncodedURIComponent(enc));
  } catch (e) {
    return <div class="pt-[30px] flex flex-col max-w-[500px] m-auto text-black">
        <h1 class="text-center text-4xl bg-white">Invalid Project</h1>
        <pre>{JSON.stringify(e, null, 2)}</pre>
        </div>
  }

  const projects = useProjects();
	const {route} = useLocation();

  const importProject = async () => {
		await saveProject(project);
		route(`/p/${project.id}`);
  }

  return <div class="pt-[30px] flex flex-col max-w-[500px] m-auto text-black">
      <h1 class="text-center text-4xl bg-white pb-3">Import {project.title}</h1>

      <p class="pb-1"><b>Last Updated:</b> {new Date(project.version).toLocaleDateString()} {new Date(project.version).toLocaleTimeString()}</p>
      <p class="pb-1"><b>Chord Charts:</b> {project.chords.map(v => v.title).join(', ')}</p>
      <p class="pb-1"><b>Setlists:</b> {project.setlists.map(v => v.title).join(', ')}</p>
      <p class="pb-1"><b>Lyrics:</b> {project.lyrics.map(v => v.title).join(', ')}</p>
      <p class="pb-1"><b>Slide Shows:</b> {project.slideShows.map(v => v.title).join(', ')}</p>

      {projects.find(v => v.id === project.id) && <p class="pb-1 text-red-700 text-lg">WARNING: This will override your existing {project.title}!</p>}

			<button onClick={importProject} class="py-1.5 text-lg px-10 mt-10 rounded shadow w-[240px] bg-blue-600 hover:bg-blue-700 text-white">Import</button>


  </div>
}

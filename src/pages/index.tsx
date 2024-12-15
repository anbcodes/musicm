import { useState } from "preact/hooks";
import { generateId } from "../util";
import { saveProject, useProjects } from "../project";
import { useLocation } from "preact-iso";
import { Log } from "../components/Log";

export function Home() {
	const projects = useProjects();
	const {route} = useLocation();
	const [error, setError] = useState('');
	
	const newProject = async () => {
		const id = generateId();
		try {
			await saveProject({id, title: "Untitled Project", version: +new Date(), chords: [], setlists: [], lyrics: [], slideShows: []});
			console.log("routed");
			route(`/p/${id}`);
		} catch (e) {
			setError(e.message)
		}
		
	}
	
	return (
		<div class="pt-[30px] flex flex-col items-center max-w-[500px] m-auto text-black">
			<h1 class="text-center pb-4 text-3xl">Projects</h1>
			{error && <p>{error}</p>}
			{projects.map(p => (<div class="p-3">
				<a href={`/p/${p.id}`}>
					<h2 class="text-2xl hover:underline">{p.title}</h2>
				</a>
			</div>))}
			<button onClick={newProject} class="p-2 px-10 mt-20 rounded shadow max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white">Create Project</button>
		</div>
	);
}

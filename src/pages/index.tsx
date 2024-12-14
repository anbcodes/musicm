import { useState } from "preact/hooks";
import { generateId } from "../util";
import { saveProject } from "../project";
import { useLocation } from "preact-iso";

export function Home() {
	const projects = JSON.parse(localStorage.getItem('projects') || '[]');
	const {route} = useLocation();
	
	const newProject = async () => {
		const id = generateId();
		await saveProject({id, title: "Untitled Project", version: +new Date(), chords: [], setlists: [], lyrics: [], slideShows: []});
		console.log("routed");
		route(`/p/${id}`);
	}
	
	return (
		<div class="pt-[30px] flex flex-col items-center max-w-[500px] m-auto text-black">
			<h1 class="text-center pb-4 text-3xl">Projects</h1>
			{projects.map(p => (<div class="p-3">
				<a href={`/p/${p.id}`}>
					<h2 class="text-2xl hover:underline">{p.title}</h2>
				</a>
			</div>))}
			<button onClick={newProject} class="p-2 px-10 mt-20 rounded shadow max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white">Create Project</button>
		</div>
	);
}

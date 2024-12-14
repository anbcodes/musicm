import { useId, useState } from "preact/hooks";
import { persistStorage, useAsyncEffect } from "./util";

export interface ChordChart {
  id: string,
  fontSize: number,
  chart: string,
  title: string,
}

export interface SetList {
  id: string,
  title: string,
  chords: {
    id: string,
    key: string,
  }[],
}

export interface Lyric {
  id: string,
  title: string,
  content: string
}

export interface SlideShow {
  id: string,
  title: string,
  lyrics: {id: string}[],
}

export interface Project {
  id: string,
  version: number,
  title: string,
  chords: ChordChart[],
  setlists: SetList[],
  lyrics: Lyric[],
  slideShows: SlideShow[],
}

export const saveProject = async (p: Project) => {
  await persistStorage();
  const dir = await navigator.storage.getDirectory();
  console.log('file', `project-${p.id}.json`);
  const file = await dir.getFileHandle(`project-${p.id}.json`, {create: true});
  const writer = await file.createWritable();
  await writer.write(JSON.stringify(p));
  await writer.close();
  let ps = JSON.parse(localStorage.getItem('projects') || '[]');
  ps = ps.filter(v => v.id !== p.id);
  ps.push({id: p.id, title: p.title, version: p.version});
  localStorage.setItem('projects', JSON.stringify(ps));
  Object.values(setProjectListeners).forEach((v) => v(ps));
}

export const removeProject = async (p: Project) => {
  await persistStorage();
  const dir = await navigator.storage.getDirectory();
  console.log('file', `project-${p.id}.json`);
  await dir.removeEntry(`project-${p.id}.json`, {recursive: true});
  
  let ps = JSON.parse(localStorage.getItem('projects') || '[]');
  ps = ps.filter(v => v.id !== p.id);
  localStorage.setItem('projects', JSON.stringify(ps));
  Object.values(setProjectListeners).forEach((v) => v(ps));
}

export function useProject(id: string): [Project, (p: Project) => void] {
  const [project, setProject] = useState<Project | undefined>(undefined);
  useAsyncEffect(async () => {
    await persistStorage();
    const dir = await navigator.storage.getDirectory();
    const file = await dir.getFileHandle(`project-${id}.json`);
  console.log('file', `project-${id}.json`);
    const content = await (await file.getFile()).text();
    console.log(content);
    const json = JSON.parse(content);
    setProject(json);
  }, []);

  return [project, (p: Project) => {
    saveProject(p);
    setProject(p);
  }]
} 

const setProjectListeners: {[id: string]: (p: Project[]) => void} = {};

export function useProjects() {
  const id = useId();
  const [projects, setProjects] = useState(JSON.parse(localStorage.getItem('projects') || '[]'));
  setProjectListeners[id] = setProjects;

  return projects;
}

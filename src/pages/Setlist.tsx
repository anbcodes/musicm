import { useRef, useState } from "preact/hooks"
import { useProject } from "../project";
import { useLocation } from "preact-iso";
import * as pdfjs from "pdfjs-dist";
import jsPDF from "jspdf";
import { ChordChartRenderer } from "../components/ChordChartRenderer";
import { renderOnto } from "@anbcodes/chordpdf/lib";
import { RemoveConfirm } from "../components/RemoveConfirm";

pdfjs.GlobalWorkerOptions.workerSrc =
  "/pdf.worker.min.mjs"

function KeyOptions() {
  return <>
    <option value="A">A</option>
    <option value="Ab">Ab</option>
    <option value="B">B</option>
    <option value="Bb">Bb</option>
    <option value="C">C</option>
    <option value="Cb">Cb</option>
    <option value="C#">C#</option>
    <option value="D">D</option>
    <option value="Db">Db</option>
    <option value="E">E</option>
    <option value="Eb">Eb</option>
    <option value="F">F</option>
    <option value="F#">F#</option>
    <option value="G">G</option>
    <option value="Gb">Gb</option>
    <option value="Abm">Abm</option>
    <option value="Am">Am</option>
    <option value="A#m">A#m</option>
    <option value="Bbm">Bbm</option>
    <option value="Bm">Bm</option>
    <option value="Cm">Cm</option>
    <option value="C#m">C#m</option>
    <option value="Dm">Dm</option>
    <option value="D#m">D#m</option>
    <option value="Ebm">Ebm</option>
    <option value="Em">Em</option>
    <option value="Fm">Fm</option>
    <option value="F#m">F#m</option>
    <option value="Gm">Gm</option>
    <option value="G#m">G#m</option>
  </>
}

export function Setlist({pid, id}: {pid: string, id: string}) {
  const [project, setProject] = useProject(pid);
  if (!project) return false;
  const setlist = project.setlists.find(v => v.id === id);
  const saveSetlist = (_setlist = setlist) => {
    let setI = project.setlists.findIndex(v => v.id === id);
    if (setI === -1) throw new Error("Setlist disappeared???");
    project.setlists[setI] = _setlist;
    setProject({...project});
  }

  const addChordCart = () => {
    setlist.chords.push({
      id: project.chords[0].id,
      key: 'G',
    });
    saveSetlist();
	}

  const removeChordChart = (i: number) => {
    setlist.chords.splice(i, 1)
    saveSetlist();
	}

  const download = () => {
    let pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
    })
  
    setlist.chords.forEach((c, i) => {
      const chord = project.chords.find(v => v.id === c.id);
      if (i !== 0) pdf.addPage();
      
      renderOnto(pdf, chord.chart, c.key, chord.fontSize);
    });

    pdf.save(`${setlist.title}.pdf`);    
  }

  const {route} = useLocation();
  const remove = () => {
    project.setlists = project.setlists.filter(v => v.id !== id);
    setProject({...project});
    route(`/p/${project.id}`);
  }

  return (
    <>
    <div class="pt-[30px] flex flex-col max-w-[600px] m-auto text-black">
			<input
        value={setlist.title}
        class="text-center pb-4 text-4xl bg-white"
        onInput={(e) => (setlist.title = (e.target as HTMLInputElement).value,saveSetlist())}
      ></input>

      <a class="self-center text-blue-500 hover:underline" href="javascript:void()" onClick={download}>Download</a>

      {
        setlist.chords.map((c, i) => (<div class="p-3 flex gap-9">
          <select value={c.id} onChange={(e) => (setlist.chords[i].id = (e.target as HTMLSelectElement).value,saveSetlist())} class="bg-white border rounded p-1">
            {project.chords.map(v => <option value={v.id}>{v.title}</option>)}
          </select>
          <select value={c.key} onChange={(e) => (setlist.chords[i].key = (e.target as HTMLSelectElement).value,saveSetlist())} class="bg-white border rounded p-1">
            <KeyOptions />
          </select>
          <a href={`/p/${project.id}/c/${c.id}`}>
            <h2 class="text-blue-500 hover:underline">view</h2>
          </a>
          <button onClick={() => removeChordChart(i)} class="text-red-600 hover:bg-red-100 px-2 py-1 rounded border-red-600 border">
            Delete
          </button>
			</div>))}
			<button onClick={addChordCart} class="p-2 px-10 mt-10 rounded shadow w-[300px] bg-blue-600 hover:bg-blue-700 text-white">Add Chord Chart</button>
      <RemoveConfirm onClick={remove} className="p-2 px-10 mt-10 w-[300px]">Remove Setlist</RemoveConfirm>

    </div>
  </>
  )
  
}

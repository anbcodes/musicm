import { useRef, useState } from "preact/hooks"
import { saveProject, useProject } from "../project";
import { useLocation } from "preact-iso";
import * as pdfjs from "pdfjs-dist";
import { ChordChartRenderer } from "../components/ChordChartRenderer";
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

export function EditChordChart({pid, id}: {pid: string, id: string}) {
  const [project, setProject] = useProject(pid);
  if (!project) return false;
  const chordChart = project.chords.find(v => v.id === id);
  const saveChordChart = (_chordChart = chordChart) => {
    let chartI = project.chords.findIndex(v => v.id === id);
    if (chartI === -1) throw new Error("Chord chart disappeared???");
    project.chords[chartI] = _chordChart;
    setProject({...project});
  }
  const [key, setKey] = useState('G');
  const downloadTag = useRef<HTMLAnchorElement>();

  console.log("Rendered")

  const {route} = useLocation();
  const remove = () => {
    project.chords = project.chords.filter(v => v.id !== id);
    setProject({...project});
    route(`/p/${project.id}`);
  }

  return (
    <>
    <div class="pt-[30px] flex flex-col items-center max-w-[500px] m-auto text-black">
			<input
        value={chordChart.title}
        class="text-center pb-4 text-4xl bg-white"
        onInput={(e) => (chordChart.title = (e.target as HTMLInputElement).value,saveChordChart())}
      ></input>
      
      <p class="pb-10">The format is fairly simple (there is an example below).
        Use "# title" to seperate sections and put the chords (in <a href="https://en.wikipedia.org/wiki/Nashville_Number_System">number notation</a>) above the words.
        If you don't use number notation, the key dropdown won't work.
        Number notation is where you take the key the song is in and call that chord a 1.
        So in the key of C, a C chord would be a 1.
        Next you go up the scale and each note gets the next number.
        So D is 2, E is 3, ..., B is 7. If you were in the key of A, 
        A is 1, B is 2, C# is 3, D is 4, etc.
      </p>
    </div>
    <div class="w-full flex justify-center">
    <div class="flex flex-wrap max-w-[1400px]">
      <div class="min-w-0 sm:min-w-[440px] m-2 mr-5 flex-grow flex flex-col items-center">
        <label for="key">Key</label>
        <select name="key" id="key" value={key} onChange={(e) => setKey((e.target as HTMLSelectElement).value)} class="bg-white border rounded p-1">
          <KeyOptions></KeyOptions>
        </select>
        <label class="pt-3" for="font-size">Font size</label>
        <input id="font-size" type="number" value={chordChart.fontSize} onInput={(e) => (chordChart.fontSize = +(e.target as HTMLInputElement).value,saveChordChart())} class="bg-white my-2 p-1" />
        <textarea class="bg-white font-mono min-w-[440px] rounded border p-2" rows={40} onInput={(e) => (chordChart.chart = (e.target as HTMLTextAreaElement).value,saveChordChart())}>
          {chordChart.chart}
        </textarea>
      </div>
      <div class="m-2 flex flex-col items-center flex-grow max-w-[900px]">
        <h2>Result</h2>
        <a class="text-blue-600 hover:underline" ref={downloadTag}>Download</a>
        <ChordChartRenderer chart={chordChart.chart} fontSize={chordChart.fontSize} key={key} downloadTag={downloadTag}></ChordChartRenderer>
      </div>
    </div>
  </div>
  <div class="pt-[30px] flex flex-col items-center max-w-[500px] m-auto text-black">
    <RemoveConfirm onClick={remove} className="ml-5 p-2 px-10 mt-10 w-[300px]">Remove Chord Chart</RemoveConfirm>
  </div>

  </>
  )
  
}

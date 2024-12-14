import { useRef, useState } from "preact/hooks"
import { useProject } from "../project";
import { useLocation } from "preact-iso";
import * as pdfjs from "pdfjs-dist";
import { ChordChartRenderer } from "../components/ChordChartRenderer";
import { LyricRenderer, totalLength } from "../components/LyricRenderer";

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

export function Lyrics({pid, id}: {pid: string, id: string}) {
  const [project, setProject] = useProject(pid);
  if (!project) return false;
  const lyrics = project.lyrics.find(v => v.id === id);
  const saveLyrics = (_lyrics = lyrics) => {
    let lyricsI = project.lyrics.findIndex(v => v.id === id);
    if (lyricsI === -1) throw new Error("Lyrics disappeared???");
    project.lyrics[lyricsI] = _lyrics;
    setProject({...project});
  }

  const [lyricLoc, setLyricLoc] = useState(0);
  const lyricsLength = totalLength(lyrics.content);
  if (lyricLoc >= lyricsLength) {
    setLyricLoc(lyricLoc - 1);
  }

  return (
    <>
    <div class="pt-[30px] flex flex-col items-center max-w-[500px] m-auto text-black">
			<input
        value={lyrics.title}
        class="text-center pb-4 text-4xl bg-white"
        onInput={(e) => (lyrics.title = (e.target as HTMLInputElement).value,saveLyrics())}
      ></input>
      
      <p class="pb-10">The format is fairly simple (there is an example below).
        Use "# title" to seperate sections. A blank line seperates slides.
      </p>
    </div>
    <div class="w-full flex justify-center">
    <div class="flex flex-wrap max-w-[1400px]">
      <div class="min-w-0 sm:min-w-[440px] m-2 mr-5 flex-grow flex flex-col items-center">
        <textarea class="bg-white font-mono min-w-[440px] rounded border p-2" rows={40} onInput={(e) => (lyrics.content = (e.target as HTMLTextAreaElement).value,saveLyrics())}>
          {lyrics.content}
        </textarea>
      </div>
      <div class="m-2 flex flex-col items-center flex-grow max-w-[900px]">
        <h2>Preview</h2>
        <LyricRenderer project={project} lyric={lyrics.id} location={lyricLoc}></LyricRenderer>
        <div class="flex gap-4 pt-5">
          <button disabled={lyricLoc <= 0} onClick={() => setLyricLoc(lyricLoc - 1)} class="p-2 border rounded disabled:bg-gray-50 disabled:text-gray-500">Prev</button>
          <button disabled={lyricLoc >= lyricsLength - 1} onClick={() => setLyricLoc(lyricLoc + 1)} class="p-2 border rounded disabled:bg-gray-50 disabled:text-gray-500">Next</button>
        </div>
      </div>
    </div>
  </div>
  </>
  )
  
}

import { useState } from "preact/hooks";

export function RemoveConfirm({onClick, className, children}: {onClick: () => void, children: any, className: string}) {
  const [removeDialog, setRemoveDialog] = useState(false);

  return <>
  <button onClick={() => setRemoveDialog(true)} class={`${className} rounded shadow w-[300px] bg-red-600 hover:bg-red-700 text-white`}>{children}</button>
  {removeDialog && (
    <div class="z-10 fixed left-0 top-0 w-screen h-screen flex justify-center" onClick={() => setRemoveDialog(false)}>
      <div class="h-[200px] shadow bg-white p-5 sm:mt-[100px] md:mt-[300px] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <h1 class="text-2xl text-center">Are you sure?</h1>
        <div class="flex-grow"></div>
        <button onClick={() => onClick()} class="text-sm py-2 mt-5 rounded shadow w-[200px] bg-red-600 hover:bg-red-700 text-white">{children}</button>
        <button onClick={() => setRemoveDialog(false)} class="text-sm py-2 mt-5 rounded shadow w-[200px] bg-blue-600 hover:bg-blue-700 text-white">Cancel</button>
      </div>
    </div>
  )}
  {removeDialog && <div class="fixed left-0 top-0 w-screen h-screen flex items-center justify-center bg-black opacity-20" onClick={() => setRemoveDialog(false)}></div>}
</>
}

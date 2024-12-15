
export function Dialog({className, text, children, setOpen, open}: {setOpen: (open: boolean) => void, text: string, open: boolean, children?: any, className?: string}) {

  return <>
  <button onClick={() => setOpen(true)} class={`${className} rounded shadow p-2`}>{text}</button>
  {open && (
    <div class="z-10 fixed left-0 top-0 w-screen h-screen flex justify-center" onClick={() => setOpen(false)}>
      <div class="h-[200px] shadow bg-white p-5 sm:mt-[100px] md:mt-[300px] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )}
  {open && <div class="fixed left-0 top-0 w-screen h-screen flex items-center justify-center bg-black opacity-20" onClick={() => setOpen(false)}></div>}
</>
}

let lastSave = new Promise(resolve => resolve());

onmessage = async function(e) {
  console.log('Worker: Message received from main script');
  await lastSave;
  lastSave = new Promise(async (resolve) => {
    let dir = await this.navigator.storage.getDirectory();
    const p = e.data.project;
    const id = e.data.id;
    const file = await dir.getFileHandle(`project-${p.id}.json`, {create: true});

    if (e.data.type === 'save') {
      // @ts-ignore
      const writer = await file.createSyncAccessHandle();
      writer.truncate(0);
      writer.write(new TextEncoder().encode(JSON.stringify(p)));
      writer.close();
      console.log("Saved");
      this.postMessage({type: "saveR", id})
    }

    resolve();
  })
  
}

import { useCallback } from "react";

export const handleExportNote = (note) => {
  useCallback((note) => {
    const dataStr = JSON.stringify(note, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [])
};



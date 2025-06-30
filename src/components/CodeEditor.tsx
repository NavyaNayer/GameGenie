import React, { useState } from 'react';
import { FileText, Wand2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import { AICodeAssistant } from '../services/aiCodeAssistant';

interface CodeEditorProps {
  files: Record<string, string>;
  activeFile: string;
  onFileChange: (filename: string) => void;
  onCodeChange: (filename: string, code: string) => void;
  onAIAssist: (filename: string, code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ files, activeFile, onFileChange, onCodeChange, onAIAssist }) => {
  const [localCode, setLocalCode] = useState(files[activeFile] || '');
  const [showNewFile, setShowNewFile] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  React.useEffect(() => {
    setLocalCode(files[activeFile] || '');
  }, [activeFile, files]);

  const handleSave = () => {
    onCodeChange(activeFile, localCode);
  };

  const handleAIAssist = async () => {
    const userPrompt = window.prompt('Describe the change or fix you want AI to make:');
    if (!userPrompt) return;
    setAiLoading(true);
    try {
      const aiResult = await AICodeAssistant.analyzeCode(localCode, userPrompt);
      if (aiResult) {
        setLocalCode(aiResult);
        onCodeChange(activeFile, aiResult);
        alert('AI Code Assistant updated your code!');
      } else {
        alert('AI did not return any code.');
      }
    } catch (e) {
      alert('AI Code Assistant failed: ' + e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    onCodeChange(newFileName, '');
    setShowNewFile(false);
    setNewFileName('');
    onFileChange(newFileName);
  };

  const handleAddFolder = () => {
    // Folders are just keys ending with '/'
    if (!newFolderName.trim()) return;
    onCodeChange(newFolderName.endsWith('/') ? newFolderName : newFolderName + '/', '');
    setShowNewFolder(false);
    setNewFolderName('');
  };

  const handleDownload = () => {
    // Download all files as a zip
    import('jszip').then(JSZip => {
      const zip = new JSZip.default();
      Object.entries(files).forEach(([name, content]) => {
        if (name.endsWith('/')) return; // skip folders
        zip.file(name, content);
      });
      zip.generateAsync({ type: 'blob' }).then(blob => {
        saveAs(blob, 'project.zip');
      });
    });
  };

  // Render file/folder tree (flat for now, can be improved)
  const fileList = Object.keys(files).sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex border rounded-lg overflow-hidden h-[500px] bg-white shadow">
      {/* File Explorer */}
      <div className="w-56 border-r bg-gray-50 p-2 overflow-y-auto flex flex-col">
        <div className="font-bold text-xs text-gray-500 mb-2 pl-2 flex items-center justify-between">
          <span>FILES</span>
          <div className="flex gap-1">
            <button className="text-blue-600 text-xs px-1" title="New File" onClick={() => setShowNewFile(true)}>+File</button>
            <button className="text-blue-600 text-xs px-1" title="New Folder" onClick={() => setShowNewFolder(true)}>+Folder</button>
            <button className="text-green-600 text-xs px-1" title="Download" onClick={handleDownload}>⭳</button>
          </div>
        </div>
        {showNewFile && (
          <div className="flex gap-1 mb-2">
            <input className="border px-1 text-xs flex-1" value={newFileName} onChange={e => setNewFileName(e.target.value)} placeholder="filename.js" />
            <button className="text-blue-600 text-xs" onClick={handleAddFile}>Add</button>
            <button className="text-gray-400 text-xs" onClick={() => setShowNewFile(false)}>✕</button>
          </div>
        )}
        {showNewFolder && (
          <div className="flex gap-1 mb-2">
            <input className="border px-1 text-xs flex-1" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="folder/" />
            <button className="text-blue-600 text-xs" onClick={handleAddFolder}>Add</button>
            <button className="text-gray-400 text-xs" onClick={() => setShowNewFolder(false)}>✕</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {fileList.map((filename) => (
            <button
              key={filename}
              onClick={() => onFileChange(filename)}
              className={`flex items-center w-full px-2 py-1 rounded text-sm mb-1 transition-colors ${
                filename === activeFile ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <FileText size={16} className="mr-2" />
              {filename}
            </button>
          ))}
        </div>
      </div>
      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b">
          <span className="font-mono text-sm text-gray-700">{activeFile}</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs flex items-center gap-1 disabled:opacity-50"
              onClick={handleAIAssist}
              disabled={aiLoading}
            >
              <Wand2 size={14} /> {aiLoading ? 'AI Working...' : 'AI Code Assistant'}
            </button>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
        <textarea
          className="flex-1 w-full p-4 text-sm bg-gray-900 text-gray-100 font-mono resize-none outline-none border-0"
          value={localCode}
          onChange={e => setLocalCode(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

import React, { useRef, useEffect, useState } from 'react';

interface Props {
  onChange: (html: string) => void;
  initialValue?: string;
}

const toolbarButtons = [
  { cmd: 'bold', label: '<b>B</b>' },
  { cmd: 'italic', label: '<i>I</i>' },
  { cmd: 'underline', label: '<u>U</u>' },
  { cmd: 'strikeThrough', label: '<s>S</s>' },
  { cmd: 'insertUnorderedList', label: '• List' },
  { cmd: 'insertOrderedList', label: '1. List' },
  { cmd: 'formatBlock', arg: 'h1', label: '<h1>H1</h1>' },
  { cmd: 'formatBlock', arg: 'h2', label: '<h2>H2</h2>' },
  { cmd: 'formatBlock', arg: 'h3', label: '<h3>H3</h3>' },
  { cmd: 'createLink', label: '🔗 Link', prompt: true },
];

const CustomTextEditor: React.FC<Props> = ({ onChange, initialValue = '' }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeCommands, setActiveCommands] = useState<string[]>([]);

  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  useEffect(() => {
    const handleSelectionChange = () => {
      updateToolbarState();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const updateContent = () => {
    const html = editorRef.current?.innerHTML || '';
    onChange(html);
    updateToolbarState();
  };

  const updateToolbarState = () => {
    const active: string[] = [];

    toolbarButtons.forEach(({ cmd }) => {
      try {
        if (document.queryCommandState(cmd)) {
          active.push(cmd);
        }
      } catch {}
    });

    setActiveCommands(active);
  };

  const execCommand = (cmd: string, arg?: string, promptUser?: boolean) => {
    let value = arg || '';
    if (promptUser) {
      const url = prompt('Enter URL');
      if (!url) return;
      value = url;
    }
    document.execCommand(cmd, false, value);
    updateContent();
  };

  return (
    <div className="border p-2 rounded-md space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b pb-2 text-sm">
        {toolbarButtons.map(({ cmd, arg, label, prompt }, i) => (
          <button
            key={i}
            type="button"
            className={`px-2 py-1 border rounded text-xs cursor-pointer transition ${
              activeCommands.includes(cmd)
                ? 'dark:bg-gray-700/30 dark:text-white bg-gray-200/80 border-gray-400 dark:border-gray-600  '
                : 'dark:hover:bg-gray-700/30 hover:bg-gray-200/80 hover:text-gray-900 dark:text-gray-300'
            }`}
            onClick={() => execCommand(cmd, arg, prompt)}
            dangerouslySetInnerHTML={{ __html: label }}
          />
        ))}
      </div>

      {/* Editable Content */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={updateContent}
        className=" editor-content min-h-[200px] p-3 border rounded focus:outline-none space-y-2 text-left"
        style={{
          direction: 'ltr',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      />
    </div>
  );
};

export default CustomTextEditor;

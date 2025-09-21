import { useCallback, useState } from "react";

type Props = {
  file: File | null;
  onFileSelected: (f: File | null) => void;
  accept?: string;
  helpText?: string;
};

export default function UploadCard({ file, onFileSelected, accept, helpText }: Props) {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileSelected(f);
  }, [onFileSelected]);

  return (
    <div
      className={`card ${dragOver ? "ring-2 ring-blue-500" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <label className="block text-sm font-medium">Upload PDF</label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => onFileSelected(e.target.files?.[0] || null)}
        className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <div className="mt-2 text-xs text-gray-500">{helpText ?? "Drag and drop a PDF or use the picker."}</div>
      {file && (
        <div className="mt-2 text-xs text-gray-600">Selected: {file.name}</div>
      )}
    </div>
  );
}


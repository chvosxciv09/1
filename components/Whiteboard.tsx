import React, { useState, useRef, useEffect } from 'react';
import { MousePointer2, Hand, StickyNote, Plus, Minus, Trash2, Move } from 'lucide-react';
import { Project, WhiteboardNote, Member } from '../types';

interface WhiteboardProps {
  project: Project;
  currentUser: Member;
  onUpdateNotes: (projectId: string, notes: WhiteboardNote[]) => void;
}

const NOTE_COLORS = {
  yellow: 'bg-yellow-200 text-yellow-900 border-yellow-300',
  blue: 'bg-blue-200 text-blue-900 border-blue-300',
  green: 'bg-green-200 text-green-900 border-green-300',
  red: 'bg-red-200 text-red-900 border-red-300',
  purple: 'bg-purple-200 text-purple-900 border-purple-300',
};

const Whiteboard: React.FC<WhiteboardProps> = ({ project, currentUser, onUpdateNotes }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<'select' | 'hand'>('select');
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const [noteDragOffset, setNoteDragOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom logic
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setScale(s => Math.min(Math.max(0.5, s + delta), 2));
    } else {
      // Pan on scroll if not zooming
       setOffset(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  // Canvas Panning Logic
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Middle mouse or Spacebar+Click or Hand tool
    if (e.button === 1 || activeTool === 'hand') {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (draggingNoteId && activeTool === 'select') {
      const newNotes = project.whiteboardNotes.map(note => {
        if (note.id === draggingNoteId) {
          return {
            ...note,
            x: (e.clientX - noteDragOffset.x - offset.x) / scale,
            y: (e.clientY - noteDragOffset.y - offset.y) / scale
          };
        }
        return note;
      });
      // Optimize: In a real app, maybe debounce this or update local state then sync
      onUpdateNotes(project.id, newNotes);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggingNoteId(null);
  };

  // Note Interaction Logic
  const addNote = (color: keyof typeof NOTE_COLORS) => {
    // Center the new note in the current view
    const container = containerRef.current;
    const centerX = container ? (container.clientWidth / 2 - offset.x) / scale : 0;
    const centerY = container ? (container.clientHeight / 2 - offset.y) / scale : 0;

    const newNote: WhiteboardNote = {
      id: Date.now().toString(),
      x: centerX - 100, // Center offset
      y: centerY - 100,
      content: '',
      color,
      authorId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    onUpdateNotes(project.id, [...project.whiteboardNotes, newNote]);
  };

  const updateNoteContent = (id: string, content: string) => {
    const newNotes = project.whiteboardNotes.map(note => 
      note.id === id ? { ...note, content } : note
    );
    onUpdateNotes(project.id, newNotes);
  };

  const deleteNote = (id: string) => {
    const newNotes = project.whiteboardNotes.filter(note => note.id !== id);
    onUpdateNotes(project.id, newNotes);
  };

  const handleNoteMouseDown = (e: React.MouseEvent, note: WhiteboardNote) => {
    if (activeTool === 'select') {
      e.stopPropagation(); // Prevent canvas panning
      setDraggingNoteId(note.id);
      // Calculate offset from mouse to note top-left, accounting for scale and pan
      setNoteDragOffset({
        x: e.clientX - (note.x * scale + offset.x),
        y: e.clientY - (note.y * scale + offset.y)
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md border border-slate-700 p-2 rounded-xl shadow-xl flex items-center gap-2 z-20">
        <button
          onClick={() => setActiveTool('select')}
          className={`p-2 rounded-lg transition-colors ${activeTool === 'select' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          title="选择工具 (V)"
        >
          <MousePointer2 size={20} />
        </button>
        <button
          onClick={() => setActiveTool('hand')}
          className={`p-2 rounded-lg transition-colors ${activeTool === 'hand' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          title="抓手工具 (H)"
        >
          <Hand size={20} />
        </button>
        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        <div className="flex gap-1">
          {(Object.keys(NOTE_COLORS) as Array<keyof typeof NOTE_COLORS>).map(color => (
            <button
              key={color}
              onClick={() => addNote(color)}
              className={`w-8 h-8 rounded-full border-2 border-slate-600 ${NOTE_COLORS[color].split(' ')[0]} hover:scale-110 transition-transform`}
              title="添加便签"
            />
          ))}
        </div>
        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        <div className="flex items-center gap-1">
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"><Minus size={16} /></button>
          <span className="text-xs font-mono text-slate-300 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"><Plus size={16} /></button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-hidden relative cursor-${activeTool === 'hand' || isDraggingCanvas ? 'grab' : 'default'} ${isDraggingCanvas ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Background Grid/Dots */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
            backgroundPosition: `${offset.x}px ${offset.y}px`
          }}
        ></div>

        {/* Content Container with Transform */}
        <div
          className="absolute top-0 left-0 w-full h-full transform-gpu origin-top-left"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`
          }}
        >
          {project.whiteboardNotes.map((note) => {
            const author = project.team.find(m => m.id === note.authorId);
            return (
              <div
                key={note.id}
                className={`absolute w-64 h-64 shadow-lg flex flex-col transition-shadow ${NOTE_COLORS[note.color]} ${draggingNoteId === note.id ? 'shadow-2xl z-50' : 'z-10'}`}
                style={{
                  left: note.x,
                  top: note.y,
                  transform: 'rotate(-1deg)'
                }}
                onMouseDown={(e) => handleNoteMouseDown(e, note)}
              >
                {/* Note Header */}
                <div className="h-8 flex justify-between items-center px-2 cursor-move opacity-50 hover:opacity-100 transition-opacity">
                  <Move size={14} />
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className="p-1 hover:bg-black/10 rounded text-current"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Note Body */}
                <textarea
                  value={note.content}
                  onChange={(e) => updateNoteContent(note.id, e.target.value)}
                  placeholder="写下你的想法..."
                  className="flex-1 w-full bg-transparent border-0 resize-none p-4 focus:ring-0 text-lg font-handwriting leading-relaxed placeholder-black/30"
                  spellCheck={false}
                  onMouseDown={(e) => e.stopPropagation()} // Allow text selection without dragging note
                />

                {/* Note Footer (Author) */}
                <div className="h-10 px-4 pb-2 flex items-center justify-end gap-2 opacity-70">
                   <span className="text-xs font-bold">{author?.name || 'Unknown'}</span>
                   {author && (
                     <img src={author.avatar} alt={author.name} className="w-6 h-6 rounded-full border border-black/10" />
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Instructions Hint */}
      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg text-xs text-slate-400 pointer-events-none">
        <p className="flex items-center gap-2"><span className="bg-slate-700 px-1.5 rounded text-white">Space</span> + 拖拽移动画布</p>
        <p className="flex items-center gap-2 mt-1"><span className="bg-slate-700 px-1.5 rounded text-white">Scroll</span> 缩放视图</p>
      </div>
    </div>
  );
};

export default Whiteboard;
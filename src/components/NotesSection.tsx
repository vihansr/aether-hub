import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Tag, 
  Clock, 
  Edit3, 
  Check, 
  X,
  StickyNote,
  Link2,
  ListTodo,
  Code,
  Copy,
  ExternalLink,
  FileText
} from 'lucide-react';
import { Note } from '../types';

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (
    title: string,
    content: string,
    color: string,
    tags: string[],
    type?: Note['type'],
    url?: string,
    listItems?: Note['listItems'],
    language?: string
  ) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote?: (id: string, updates: Partial<Note>) => void;
}

const COLOR_PRESETS = [
  { class: 'bg-[#ffffff] border-[#b08b46]/15 text-[#2d2a26] shadow-sm', name: 'Muted Cream', value: 'slate' },
  { class: 'bg-[#ffffff] border-[#b08b46]/40 text-[#2d2a26] shadow-[0_4px_15px_rgba(176,139,70,0.08)]', name: 'Warm Gold', value: 'amber' },
  { class: 'bg-[#ffffff] border-emerald-500/20 text-[#2d2a26] shadow-sm', name: 'Fresh Emerald', value: 'emerald' },
  { class: 'bg-[#ffffff] border-sky-500/20 text-[#2d2a26] shadow-sm', name: 'Cool Sky', value: 'sky' },
  { class: 'bg-[#ffffff] border-rose-500/20 text-[#2d2a26] shadow-sm', name: 'Soft Rose', value: 'rose' },
  { class: 'bg-[#ffffff] border-violet-500/20 text-[#2d2a26] shadow-sm', name: 'Luxe Violet', value: 'violet' },
];

const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'shell', label: 'Shell / Bash' },
  { value: 'sql', label: 'SQL' },
];

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
}) => {
  // Creator form state
  const [noteType, setNoteType] = useState<Required<Note>['type']>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedColor, setSelectedColor] = useState('slate');

  // Link type states
  const [urlInput, setUrlInput] = useState('');

  // List type states
  const [listItems, setListItems] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newListItem, setNewListItem] = useState('');

  // Code type states
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editListItems, setEditListItems] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [editNewItemText, setEditNewItemText] = useState('');
  const [editLanguage, setEditLanguage] = useState('javascript');

  const handleAddListItem = () => {
    if (!newListItem.trim()) return;
    setListItems(prev => [
      ...prev,
      { id: `item-${Date.now()}-${Math.random()}`, text: newListItem.trim(), completed: false }
    ]);
    setNewListItem('');
  };

  const handleRemoveCreatorListItem = (id: string) => {
    setListItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations based on type
    if (noteType === 'text' && !title.trim() && !content.trim()) return;
    if (noteType === 'link' && !urlInput.trim()) return;
    if (noteType === 'list' && !title.trim() && listItems.length === 0) return;
    if (noteType === 'code' && !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    let finalTitle = title.trim();
    let finalContent = content.trim();

    if (noteType === 'link') {
      finalTitle = finalTitle || 'Link Bookmark';
      finalContent = finalContent || '';
    } else if (noteType === 'list') {
      finalTitle = finalTitle || 'Checklist Note';
      finalContent = '';
    } else if (noteType === 'code') {
      finalTitle = finalTitle || 'Code Snippet';
    }

    onAddNote(
      finalTitle,
      finalContent,
      selectedColor,
      tags,
      noteType,
      noteType === 'link' ? urlInput.trim() : undefined,
      noteType === 'list' ? listItems : undefined,
      noteType === 'code' ? selectedLanguage : undefined
    );

    // Reset fields
    setTitle('');
    setContent('');
    setTagsInput('');
    setSelectedColor('slate');
    setUrlInput('');
    setListItems([]);
    setNewListItem('');
    setSelectedLanguage('javascript');
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setEditUrl(note.url || '');
    setEditListItems(note.listItems || []);
    setEditLanguage(note.language || 'javascript');
    setEditNewItemText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    if (onUpdateNote) {
      const tags = editTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      onUpdateNote(id, {
        title: editTitle.trim() || 'Untitled Note',
        content: editContent.trim(),
        tags,
        url: editUrl.trim() || undefined,
        listItems: editListItems.length > 0 ? editListItems : undefined,
        language: editLanguage || undefined
      });
    }
    setEditingId(null);
  };

  const handleToggleListItem = (noteId: string, itemId: string) => {
    if (!onUpdateNote) return;
    const note = notes.find(n => n.id === noteId);
    if (!note || !note.listItems) return;

    const updatedItems = note.listItems.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    onUpdateNote(noteId, { listItems: updatedItems });
  };

  const filteredNotes = notes.filter((note) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      (note.url && note.url.toLowerCase().includes(searchLower)) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower));
    return matchesSearch;
  });

  const getNoteColorClass = (colorVal: string) => {
    const preset = COLOR_PRESETS.find(p => p.value === colorVal);
    return preset ? preset.class : COLOR_PRESETS[0].class;
  };

  const getNoteIcon = (type?: Note['type']) => {
    switch (type) {
      case 'link': return <Link2 className="w-3.5 h-3.5 text-[#b08b46]" />;
      case 'list': return <ListTodo className="w-3.5 h-3.5 text-[#b08b46]" />;
      case 'code': return <Code className="w-3.5 h-3.5 text-[#b08b46]" />;
      default: return <FileText className="w-3.5 h-3.5 text-[#b08b46]" />;
    }
  };

  return (
    <div className="space-y-6" id="notes-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#b08b46]/10 pb-5">
        <div>
          <h2 className="font-serif text-3xl italic font-light text-[#b08b46] flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20">
              <StickyNote className="w-5 h-5" />
            </span>
            Notes Vault
          </h2>
          <p className="text-xs text-[#2d2a26]/60 mt-1 font-sans">
            Store logs, links, checklists, snippets, and research data in your personal hub.
          </p>
        </div>
        <div className="relative w-full md:w-72" id="notes-search-wrapper">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b08b46]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, links & tags..."
            className="w-full bg-[#ffffff] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors shadow-sm"
            id="notes-search-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="notes-workspace">
        {/* Creator Panel */}
        <div className="lg:col-span-4 bg-[#ffffff] border border-[#b08b46]/15 rounded-2xl p-5 h-fit space-y-4 shadow-md" id="note-creator-card">
          <h3 className="font-serif italic text-base text-[#2d2a26] border-b border-[#b08b46]/10 pb-2">Create Entry</h3>
          
          {/* Note Type Selector Tabs */}
          <div className="flex bg-[#faf8f5] p-1 rounded-xl border border-[#b08b46]/10 text-[10px] font-semibold text-center select-none">
            <button
              type="button"
              onClick={() => setNoteType('text')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${noteType === 'text' ? 'bg-[#b08b46] text-white shadow-sm' : 'text-[#2d2a26]/60 hover:text-[#b08b46]'}`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setNoteType('link')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${noteType === 'link' ? 'bg-[#b08b46] text-white shadow-sm' : 'text-[#2d2a26]/60 hover:text-[#b08b46]'}`}
            >
              Link
            </button>
            <button
              type="button"
              onClick={() => setNoteType('list')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${noteType === 'list' ? 'bg-[#b08b46] text-white shadow-sm' : 'text-[#2d2a26]/60 hover:text-[#b08b46]'}`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setNoteType('code')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${noteType === 'code' ? 'bg-[#b08b46] text-white shadow-sm' : 'text-[#2d2a26]/60 hover:text-[#b08b46]'}`}
            >
              Code
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title (for everyone) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">
                Title {noteType === 'link' || noteType === 'list' ? '(Optional)' : ''}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  noteType === 'link' ? 'e.g. Supabase Docs' :
                  noteType === 'list' ? 'e.g. Weekend Tasks' :
                  noteType === 'code' ? 'e.g. Database setup query' : 'Title'
                }
                className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Type Specific Fields */}
            {noteType === 'link' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">URL / Address</label>
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                />
              </div>
            )}

            {noteType === 'code' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Snippet Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] focus:outline-none transition-colors"
                >
                  {CODE_LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
            )}

            {noteType === 'list' && (
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">List Items</label>
                
                {/* List items added so far */}
                {listItems.length > 0 && (
                  <div className="space-y-1 bg-[#faf8f5] p-2.5 rounded-xl border border-[#b08b46]/10 max-h-36 overflow-y-auto mb-2">
                    {listItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs text-[#2d2a26] group py-0.5">
                        <span className="truncate">{item.text}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCreatorListItem(item.id)}
                          className="text-[#2d2a26]/40 hover:text-rose-500 transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newListItem}
                    onChange={(e) => setNewListItem(e.target.value)}
                    placeholder="New list item..."
                    className="flex-1 bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-1.5 text-xs text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddListItem();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddListItem}
                    className="px-3 bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20 hover:bg-[#b08b46]/20 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Note Content / Description (Not for list type) */}
            {noteType !== 'list' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">
                  {noteType === 'link' ? 'Notes / Description' :
                   noteType === 'code' ? 'Code Content' : 'Content'}
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    noteType === 'link' ? 'Write an optional summary or notes for this link...' :
                    noteType === 'code' ? 'Paste code block...' : 'Write your note contents here...'
                  }
                  rows={noteType === 'code' ? 6 : 4}
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors resize-none leading-relaxed font-sans"
                  required={noteType === 'text' || noteType === 'code'}
                />
              </div>
            )}

            {/* Tags Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ideas, journal, links..."
                className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Color Accent Picker */}
            <div className="space-y-2">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">Accent Highlight</label>
              <div className="flex flex-wrap gap-2.5" id="note-color-picker">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setSelectedColor(preset.value)}
                    className={`w-5.5 h-5.5 rounded-full border transition-all cursor-pointer relative flex items-center justify-center ${
                      preset.value === 'slate' ? 'bg-[#b08b46]/10 border-[#b08b46]/30' : 
                      preset.value === 'amber' ? 'bg-[#b08b46] border-[#b08b46]' :
                      preset.value === 'emerald' ? 'bg-emerald-500 border-emerald-400' :
                      preset.value === 'sky' ? 'bg-sky-500 border-sky-400' :
                      preset.value === 'rose' ? 'bg-rose-500 border-rose-400' :
                      'bg-violet-500 border-violet-400'
                    } ${
                      selectedColor === preset.value 
                        ? 'scale-115 ring-1 ring-[#b08b46] ring-offset-2 ring-offset-[#ffffff]' 
                        : 'hover:scale-105 opacity-80'
                    }`}
                    title={preset.name}
                  >
                    {selectedColor === preset.value && (
                      <Check className="w-3 h-3 text-[#ffffff] stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#b08b46] hover:bg-[#967438] text-[#ffffff] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              Save Entry
            </button>
          </form>
        </div>

        {/* Display Grid */}
        <div className="lg:col-span-8 space-y-4" id="notes-grid-container">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#b08b46]/15 rounded-2xl bg-[#faf8f5]/40">
              <StickyNote className="w-6 h-6 text-[#b08b46]/40 mx-auto mb-2" />
              <p className="text-[#2d2a26]/70 text-xs font-semibold font-serif italic">No entries matched your search</p>
              <p className="text-[#2d2a26]/40 text-[11px] mt-1 font-sans">
                {searchQuery ? 'Try clearing your filters or changing search keywords.' : 'Capture your thoughts, save links, or write code snippets!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto pr-1" id="notes-grid">
              {filteredNotes.map((note) => {
                const isEditing = editingId === note.id;
                const noteType = note.type || 'text';

                return (
                  <div
                    key={note.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group ${getNoteColorClass(
                      note.color
                    )}`}
                    id={`note-card-${note.id}`}
                  >
                    {isEditing ? (
                      /* Editing Mode */
                      <div className="space-y-3.5 w-full">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-[#b08b46]/20 rounded-lg px-2.5 py-1.5 text-xs text-[#2d2a26] focus:outline-none focus:border-[#b08b46]"
                          placeholder="Title"
                        />

                        {noteType === 'link' && (
                          <input
                            type="url"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-[#b08b46]/20 rounded-lg px-2.5 py-1.5 text-xs text-[#2d2a26] focus:outline-none focus:border-[#b08b46]"
                            placeholder="URL"
                          />
                        )}

                        {noteType === 'code' && (
                          <select
                            value={editLanguage}
                            onChange={(e) => setEditLanguage(e.target.value)}
                            className="w-full bg-[#faf8f5] border border-[#b08b46]/20 rounded-lg px-2.5 py-1.5 text-xs text-[#2d2a26] focus:outline-none focus:border-[#b08b46]"
                          >
                            {CODE_LANGUAGES.map(lang => (
                              <option key={lang.value} value={lang.value}>{lang.label}</option>
                            ))}
                          </select>
                        )}

                        {noteType === 'list' && (
                          <div className="space-y-1.5 bg-[#faf8f5] p-2 rounded-lg border border-[#b08b46]/10">
                            {editListItems.map((item, index) => (
                              <div key={item.id} className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={item.text}
                                  onChange={(e) => {
                                    const newItems = [...editListItems];
                                    newItems[index] = { ...item, text: e.target.value };
                                    setEditListItems(newItems);
                                  }}
                                  className="flex-1 bg-white border border-[#b08b46]/15 rounded px-2 py-0.5 text-xs text-[#2d2a26]"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditListItems(editListItems.filter(i => i.id !== item.id))}
                                  className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-1.5 mt-2">
                              <input
                                type="text"
                                value={editNewItemText}
                                onChange={(e) => setEditNewItemText(e.target.value)}
                                placeholder="Add item..."
                                className="flex-1 bg-white border border-[#b08b46]/15 rounded px-2 py-0.5 text-xs text-[#2d2a26]"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (editNewItemText.trim()) {
                                      setEditListItems([...editListItems, { id: `item-${Date.now()}-${Math.random()}`, text: editNewItemText.trim(), completed: false }]);
                                      setEditNewItemText('');
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (editNewItemText.trim()) {
                                    setEditListItems([...editListItems, { id: `item-${Date.now()}-${Math.random()}`, text: editNewItemText.trim(), completed: false }]);
                                    setEditNewItemText('');
                                  }
                                }}
                                className="px-2 bg-[#b08b46] text-white rounded text-[10px] font-semibold"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        )}

                        {noteType !== 'list' && (
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            className="w-full bg-[#faf8f5] border border-[#b08b46]/20 rounded-lg px-2.5 py-1.5 text-xs text-[#2d2a26] focus:outline-none focus:border-[#b08b46] resize-none leading-relaxed font-sans"
                            placeholder="Content"
                          />
                        )}

                        <input
                          type="text"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="comma-separated tags"
                          className="w-full bg-[#faf8f5] border border-[#b08b46]/20 rounded-lg px-2.5 py-1.5 text-xs text-[#2d2a26] focus:outline-none focus:border-[#b08b46]"
                        />
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 bg-[#faf8f5] hover:bg-[#eae6db] border border-[#b08b46]/15 text-[#2d2a26]/70 rounded-lg text-[9px] uppercase font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(note.id)}
                            className="p-1.5 bg-[#b08b46] hover:bg-[#967438] text-[#ffffff] rounded-lg text-[9px] uppercase font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Read Mode */
                      <>
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="p-1 rounded-lg bg-[#b08b46]/5 border border-[#b08b46]/10 flex-shrink-0">
                                {getNoteIcon(note.type)}
                              </span>
                              <h4 className="font-serif italic font-medium text-base text-[#2d2a26] truncate leading-tight">
                                {note.title}
                              </h4>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEdit(note)}
                                className="p-1.5 text-[#2d2a26]/50 hover:text-[#b08b46] hover:bg-[#b08b46]/5 rounded-md transition-all cursor-pointer"
                                title="Edit entry"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteNote(note.id)}
                                className="p-1.5 text-[#2d2a26]/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-all cursor-pointer"
                                title="Delete entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* LINK Note Representation */}
                          {noteType === 'link' && note.url && (
                            <div className="my-2.5">
                              <a
                                href={note.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[#b08b46] hover:underline text-xs font-mono break-all bg-[#b08b46]/5 px-3 py-2 border border-[#b08b46]/10 rounded-xl transition-all hover:bg-[#b08b46]/10 group/link"
                              >
                                <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate flex-1">{note.url}</span>
                                <ExternalLink className="w-3 h-3 flex-shrink-0 ml-auto opacity-60 group-hover/link:opacity-100" />
                              </a>
                            </div>
                          )}

                          {/* CHECKLIST Note Representation */}
                          {noteType === 'list' && note.listItems && (
                            <div className="space-y-1.5 my-2.5 bg-[#faf8f5]/60 p-3 rounded-xl border border-[#b08b46]/5 max-h-48 overflow-y-auto">
                              {note.listItems.map(item => (
                                <label 
                                  key={item.id} 
                                  className="flex items-start gap-2.5 text-xs cursor-pointer group/item select-none py-0.5"
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => handleToggleListItem(note.id, item.id)}
                                    className="rounded border-[#b08b46]/25 text-[#b08b46] focus:ring-[#b08b46] w-4 h-4 mt-0.5 cursor-pointer accent-[#b08b46]"
                                  />
                                  <span className={`transition-all break-words flex-1 leading-normal ${item.completed ? 'line-through text-[#2d2a26]/40' : 'text-[#2d2a26]'}`}>
                                    {item.text}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}

                          {/* CODE Snippet Representation */}
                          {noteType === 'code' && (
                            <div className="relative my-2.5 group/code">
                              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded bg-[#b08b46]/10 border border-[#b08b46]/15 text-[#b08b46] text-[8px] uppercase tracking-wider font-semibold font-mono select-none">
                                  {note.language || 'text'}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(note.content);
                                    alert('Code copied to clipboard!');
                                  }}
                                  className="p-1 bg-white hover:bg-gray-100 border border-[#b08b46]/15 rounded text-[#b08b46] opacity-0 group-hover/code:opacity-100 transition-opacity cursor-pointer shadow-sm"
                                  title="Copy code"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                              <pre className="bg-[#faf8f5] border border-[#b08b46]/10 p-3 pt-8 rounded-xl text-[10px] font-mono text-left overflow-x-auto max-h-48 whitespace-pre leading-relaxed select-text shadow-inner">
                                <code>{note.content}</code>
                              </pre>
                            </div>
                          )}

                          {/* Description/Content rendering (not for list since content is blank) */}
                          {noteType !== 'list' && note.content && (
                            <p className="text-xs text-[#2d2a26]/85 leading-relaxed font-sans break-words whitespace-pre-wrap">
                              {note.content}
                            </p>
                          )}
                        </div>

                        {/* Footer details */}
                        <div className="pt-4 mt-5 border-t border-[#b08b46]/10 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {note.tags.length === 0 ? (
                              <span className="text-[#2d2a26]/30 italic text-[9px]">No tags</span>
                            ) : (
                              note.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-full bg-[#faf8f5]/80 border border-[#b08b46]/15 text-[9px] text-[#2d2a26]/70 flex items-center gap-0.5 font-mono shadow-sm"
                                >
                                  <Tag className="w-2.5 h-2.5 text-[#b08b46]/60 flex-shrink-0" />
                                  {tag}
                                </span>
                              ))
                            )}
                          </div>

                          {/* Created date */}
                          <span className="text-[#2d2a26]/40 font-mono text-[9px] flex items-center gap-1 select-none flex-shrink-0">
                            <Clock className="w-3 h-3 text-[#b08b46]/60" />
                            {new Date(note.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

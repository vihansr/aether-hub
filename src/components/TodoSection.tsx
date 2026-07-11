import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  AlertCircle,
  Filter,
  Check
} from 'lucide-react';
import { Todo } from '../types';

interface TodoSectionProps {
  todos: Todo[];
  onAddTodo: (text: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onClearCompleted: () => void;
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onClearCompleted,
}) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTodo(text.trim(), priority, dueDate || undefined);
    setText('');
    setPriority('medium');
    setDueDate('');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityBadgeClass = (p: 'low' | 'medium' | 'high') => {
    switch (p) {
      case 'high': return 'bg-rose-50 text-rose-600 border border-rose-200/60';
      case 'medium': return 'bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20';
      case 'low': return 'bg-[#2d2a26]/5 text-[#2d2a26]/70 border border-[#2d2a26]/10';
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const remainingCount = todos.length - completedCount;

  return (
    <div className="space-y-6" id="todo-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#b08b46]/10 pb-5">
        <div>
          <h2 className="font-serif text-3xl italic font-light text-[#b08b46] flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20">
              <CheckSquareIcon className="w-5 h-5" />
            </span>
            Task Checklist
          </h2>
          <p className="text-xs text-[#2d2a26]/60 mt-1 font-sans">
            Manage your daily tasks, critical responsibilities, and key micro-goals.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#2d2a26]/50 font-mono" id="todo-stats">
          <span className="px-2.5 py-1 rounded-full bg-[#faf8f5] border border-[#b08b46]/15 shadow-sm">
            Active: <strong className="text-[#b08b46]">{remainingCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#faf8f5] border border-[#b08b46]/15 shadow-sm">
            Completed: <strong className="text-[#2d2a26]/80">{completedCount}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="todo-workspace">
        {/* Input Card */}
        <div className="bg-[#ffffff] border border-[#b08b46]/15 rounded-2xl p-5 h-fit space-y-4 shadow-md" id="todo-input-card">
          <h3 className="font-serif italic text-base text-[#2d2a26] border-b border-[#b08b46]/10 pb-2">Add New Task</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Task Title</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                required
                id="todo-input-text"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2.5 text-xs text-[#2d2a26] focus:outline-none transition-colors cursor-pointer"
                  id="todo-input-priority"
                >
                  <option value="low" className="bg-[#ffffff]">🟢 Low</option>
                  <option value="medium" className="bg-[#ffffff]">🟡 Medium</option>
                  <option value="high" className="bg-[#ffffff]">🔴 High</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-xs text-[#2d2a26] focus:outline-none transition-colors cursor-pointer"
                  id="todo-input-date"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#b08b46] hover:bg-[#b08b46]/90 active:bg-[#b08b46]/80 text-[#ffffff] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              id="todo-add-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4" id="todo-list-container">
          {/* Controls & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#ffffff]/60 p-2.5 rounded-xl border border-[#b08b46]/10">
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#b08b46]/50 ml-1.5" />
              <div className="flex items-center gap-1 text-xs">
                {(['all', 'active', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer capitalize ${
                      filter === f 
                        ? 'bg-[#b08b46]/15 text-[#b08b46] border border-[#b08b46]/20' 
                        : 'text-[#2d2a26]/50 hover:text-[#2d2a26] hover:bg-[#b08b46]/5'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {completedCount > 0 && (
              <button
                onClick={onClearCompleted}
                className="text-xs text-rose-500 hover:text-rose-600 transition-colors font-semibold cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/5"
              >
                Clear Completed
              </button>
            )}
          </div>

          {/* List display */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[#b08b46]/15 rounded-2xl bg-[#ffffff]/30">
                <AlertCircle className="w-6 h-6 text-[#b08b46]/40 mx-auto mb-2" />
                <p className="text-[#2d2a26]/70 text-xs font-semibold font-serif italic">No tasks found</p>
                <p className="text-[#2d2a26]/40 text-[11px] mt-1 font-sans">
                  {filter === 'all' 
                    ? 'Get started by creating your first task above.' 
                    : `No ${filter} tasks matched your current filter.`}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    todo.completed 
                      ? 'bg-[#faf8f5]/40 border-[#b08b46]/5 text-[#2d2a26]/45' 
                      : 'bg-[#ffffff] border-[#b08b46]/10 text-[#2d2a26] hover:border-[#b08b46]/30'
                  }`}
                  id={`todo-item-${todo.id}`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleTodo(todo.id)}
                      className={`cursor-pointer transition-transform duration-100 hover:scale-110 flex-shrink-0 ${
                        todo.completed ? 'text-[#b08b46]' : 'text-[#2d2a26]/30 hover:text-[#b08b46]'
                      }`}
                      id={`todo-check-${todo.id}`}
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 fill-[#b08b46]/5 text-[#b08b46]" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p className={`text-sm font-medium break-words leading-snug ${todo.completed ? 'line-through decoration-[#2d2a26]/20 text-[#2d2a26]/40' : 'text-[#2d2a26]'}`}>
                        {todo.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase ${getPriorityBadgeClass(todo.priority)}`}>
                          {todo.priority}
                        </span>
                        {todo.dueDate && (
                          <span className="text-[9px] text-[#2d2a26]/40 font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#b08b46]" />
                            {new Date(todo.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-2 text-[#2d2a26]/40 hover:text-rose-500 rounded-lg hover:bg-rose-500/5 transition-all cursor-pointer ml-2 flex-shrink-0"
                    id={`todo-delete-${todo.id}`}
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal replacement component
const CheckSquareIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 11 3 3L22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);

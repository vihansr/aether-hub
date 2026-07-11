import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Trash2, 
  Calendar, 
  Tag, 
  Info,
  X
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarSectionProps {
  events: CalendarEvent[];
  onAddEvent: (title: string, date: string, time?: string, type?: CalendarEvent['type'], description?: string) => void;
  onDeleteEvent: (id: string) => void;
}

const EVENT_TYPES: { value: CalendarEvent['type']; label: string; bg: string; text: string; border: string }[] = [
  { value: 'general', label: 'General / Plan', bg: 'bg-[#b08b46]/10', text: 'text-[#b08b46]', border: 'border-[#b08b46]/20' },
  { value: 'fitness', label: 'Fitness workout', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200/60' },
  { value: 'meal', label: 'Diet / Meal Prep', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200/60' },
  { value: 'sleep', label: 'Sleep schedule', bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200/60' },
  { value: 'todo', label: 'To-do / Tasks', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200/60' },
  { value: 'note', label: 'Idea / Reminder', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/60' },
];

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  events,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Default selected date: today (as string YYYY-MM-DD)
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New event inputs
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<CalendarEvent['type']>('general');
  const [description, setDescription] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 6 is Saturday

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dayNum: number) => {
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(dayNum).padStart(2, '0');
    setSelectedDateStr(`${year}-${paddedMonth}-${paddedDay}`);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent(
      title.trim(),
      selectedDateStr,
      time || undefined,
      type,
      description.trim() || undefined
    );

    setTitle('');
    setTime('');
    setType('general');
    setDescription('');
    setIsModalOpen(false);
  };

  // Get events for specific date (YYYY-MM-DD)
  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => e.date === dateStr);
  };

  const selectedDateEvents = getEventsForDate(selectedDateStr);

  // Format header display
  const formatSelectedHeader = () => {
    const d = new Date(selectedDateStr + 'T00:00:00'); // avoid timezone shifts
    return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getEventTypeStyle = (val: CalendarEvent['type']) => {
    return EVENT_TYPES.find(e => e.value === val) || EVENT_TYPES[0];
  };

  return (
    <div className="space-y-6" id="calendar-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#b08b46]/10 pb-5">
        <div>
          <h2 className="font-serif text-3xl italic font-light text-[#b08b46] flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-[#b08b46]/10 text-[#b08b46] border border-[#b08b46]/20">
              <Calendar className="w-5 h-5" />
            </span>
            Schedule & Planner
          </h2>
          <p className="text-xs text-[#2d2a26]/60 mt-1 font-sans">
            Map out habits, log workouts, plan nutrition, and organize your future tasks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="calendar-workspace">
        {/* Left Side: Monthly Grid */}
        <div className="xl:col-span-7 bg-[#ffffff] border border-[#b08b46]/15 rounded-2xl p-5 space-y-4 shadow-md" id="calendar-grid-card">
          {/* Calendar Header with arrows */}
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-serif italic font-medium text-lg text-[#2d2a26]">
              {monthsList[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-[#b08b46]/10 rounded-lg text-[#2d2a26]/60 hover:text-[#b08b46] transition-colors cursor-pointer border border-[#b08b46]/15"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-[#b08b46]/10 rounded-lg text-[#2d2a26]/60 hover:text-[#b08b46] transition-colors cursor-pointer border border-[#b08b46]/15"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] uppercase font-bold text-[#2d2a26]/40 border-b border-[#b08b46]/10 pb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1" id="calendar-days-grid">
            {/* Blank placeholder spaces for leading days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="aspect-square bg-[#faf8f5]/40 rounded-xl opacity-40 border border-transparent" />
            ))}

            {/* Actual Days of the Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const paddedMonth = String(month + 1).padStart(2, '0');
              const paddedDay = String(dayNum).padStart(2, '0');
              const dateKey = `${year}-${paddedMonth}-${paddedDay}`;
              const dayEvents = getEventsForDate(dateKey);
              
              const isSelected = dateKey === selectedDateStr;
              const isTodayStr = new Date().toISOString().split('T')[0] === dateKey;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => handleDayClick(dayNum)}
                  className={`aspect-square rounded-xl p-1 relative flex flex-col justify-between items-center border transition-all cursor-pointer group ${
                    isSelected 
                      ? 'bg-[#b08b46] border-[#b08b46] text-[#ffffff] font-bold shadow-md shadow-[#b08b46]/15' 
                      : isTodayStr
                      ? 'bg-[#b08b46]/10 border-[#b08b46]/40 text-[#b08b46] font-bold'
                      : 'bg-[#faf8f5] border-[#b08b46]/10 text-[#2d2a26]/70 hover:bg-[#b08b46]/5 hover:border-[#b08b46]/35 hover:text-[#2d2a26]'
                  }`}
                  id={`cal-day-${dateKey}`}
                >
                  {/* Day Number */}
                  <span className="text-xs">{dayNum}</span>

                  {/* Indicators for events */}
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-0.5 max-w-full pb-0.5">
                      {dayEvents.slice(0, 4).map((e) => {
                        const dotColor = 
                          e.type === 'fitness' ? 'bg-rose-500' :
                          e.type === 'meal' ? 'bg-sky-500' :
                          e.type === 'sleep' ? 'bg-violet-500' :
                          e.type === 'todo' ? 'bg-emerald-500' :
                          e.type === 'note' ? 'bg-amber-500' :
                          'bg-[#b08b46]';
                        return (
                          <span 
                            key={e.id} 
                            className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[#ffffff]' : dotColor}`} 
                            title={e.title}
                          />
                        );
                      })}
                      {dayEvents.length > 4 && (
                        <span className={`text-[7px] font-bold ${isSelected ? 'text-[#ffffff]' : 'text-[#2d2a26]/40'}`}>+</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Event Planner / Creator */}
        <div className="xl:col-span-5 flex flex-col gap-5" id="calendar-planner-side">
          {/* Selected Date Header */}
          <div className="bg-[#ffffff] border border-[#b08b46]/10 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="p-2 rounded-xl bg-[#b08b46]/10 text-[#b08b46] flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold uppercase text-[#2d2a26]/40">Selected Date</span>
              <h3 className="font-serif italic text-sm text-[#2d2a26] mt-0.5 leading-snug">
                {formatSelectedHeader()}
              </h3>
            </div>
          </div>

          {/* Add Event Form */}
          <div className="bg-[#ffffff] border border-[#b08b46]/15 rounded-2xl p-5 space-y-4 shadow-md" id="add-event-card">
            <h3 className="font-serif italic text-base text-[#2d2a26] border-b border-[#b08b46]/10 pb-2">Add Schedule Event</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Event Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Morning Jog, Nutrition Review, Meeting"
                    className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                    required
                    id="event-input-title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Time (optional)</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2 text-xs text-[#2d2a26] focus:outline-none transition-colors cursor-pointer"
                    id="event-input-time"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Type / Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2 text-xs text-[#2d2a26] focus:outline-none transition-colors cursor-pointer"
                    id="event-input-type"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-[#ffffff]">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest">Short description (optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context or locations..."
                  className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                  id="event-input-desc"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#b08b46] hover:bg-[#b08b46]/90 active:bg-[#b08b46]/80 text-[#ffffff] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                id="event-add-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Event
              </button>
            </form>
          </div>

          {/* Events list for selected date */}
          <div className="flex-1 space-y-3" id="scheduled-events-list">
            <h4 className="font-sans font-semibold text-[#2d2a26]/40 text-[10px] uppercase tracking-widest">
              Events Scheduled ({selectedDateEvents.length})
            </h4>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {selectedDateEvents.length === 0 ? (
                <div className="p-6 border border-dashed border-[#b08b46]/15 rounded-2xl text-center bg-[#ffffff]/60">
                  <Info className="w-5 h-5 text-[#b08b46]/40 mx-auto mb-1.5" />
                  <p className="text-[#2d2a26]/40 text-xs font-sans">No plans made for this date yet.</p>
                </div>
              ) : (
                selectedDateEvents.map((evt) => {
                  const style = getEventTypeStyle(evt.type);
                  return (
                    <div
                      key={evt.id}
                      className="p-3.5 rounded-xl bg-[#ffffff] border border-[#b08b46]/10 flex items-start justify-between gap-3 shadow-sm"
                      id={`event-item-${evt.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}>
                            {evt.type}
                          </span>
                          {evt.time && (
                            <span className="text-[10px] text-[#2d2a26]/50 font-mono flex items-center gap-0.5 select-none">
                              <Clock className="w-3 h-3 text-[#b08b46]/60" />
                              {evt.time}
                            </span>
                          )}
                        </div>
                        <h5 className="font-serif italic font-medium text-sm text-[#2d2a26] mt-1.5 break-words">
                          {evt.title}
                        </h5>
                        {evt.description && (
                          <p className="text-xs text-[#2d2a26]/60 mt-1 break-words">
                            {evt.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => onDeleteEvent(evt.id)}
                        className="p-1.5 text-[#2d2a26]/40 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-colors cursor-pointer"
                        id={`event-delete-${evt.id}`}
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add / Manage Day Event Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsModalOpen(false)}
          id="event-modal-backdrop"
        >
          <div 
            className="bg-[#ffffff] border border-[#b08b46]/20 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-transform duration-300 transform scale-100"
            onClick={(e) => e.stopPropagation()}
            id="event-modal-content"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#b08b46]/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#b08b46]/10 text-[#b08b46] flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif italic text-lg text-[#2d2a26] leading-none">
                    Schedule for {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <span className="text-[10px] text-[#2d2a26]/40 font-mono mt-1.5 block">Manage plans and additions</span>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-[#b08b46]/10 rounded-lg text-[#2d2a26]/40 hover:text-[#b08b46] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Two Columns on MD+ screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto py-1 flex-1 min-h-0">
              {/* Left Side: Existing Events list */}
              <div className="space-y-3 flex flex-col min-h-0" id="modal-events-list">
                <h4 className="font-sans font-semibold text-[#2d2a26]/50 text-[11px] uppercase tracking-widest border-b border-[#b08b46]/10 pb-1.5">
                  Scheduled Plans ({selectedDateEvents.length})
                </h4>
                <div className="space-y-2 overflow-y-auto flex-1 max-h-[250px] md:max-h-[350px] pr-1">
                  {selectedDateEvents.length === 0 ? (
                    <div className="py-12 px-4 border border-dashed border-[#b08b46]/15 rounded-xl text-center bg-[#faf8f5]/40 h-full flex flex-col items-center justify-center">
                      <Info className="w-6 h-6 text-[#b08b46]/30 mb-1.5" />
                      <p className="text-[#2d2a26]/50 text-xs font-serif italic">No plans scheduled for this day</p>
                      <p className="text-[#2d2a26]/40 text-[10px] mt-1 font-sans">Use the form to list your goals or tasks.</p>
                    </div>
                  ) : (
                    selectedDateEvents.map((evt) => {
                      const style = getEventTypeStyle(evt.type);
                      return (
                        <div
                          key={evt.id}
                          className="p-3 rounded-xl bg-[#faf8f5]/50 border border-[#b08b46]/10 flex items-start justify-between gap-3 hover:border-[#b08b46]/30 transition-all shadow-xs"
                          id={`modal-event-item-${evt.id}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}>
                                {evt.type}
                              </span>
                              {evt.time && (
                                <span className="text-[9px] text-[#2d2a26]/50 font-mono flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5 text-[#b08b46]/60" />
                                  {evt.time}
                                </span>
                              )}
                            </div>
                            <h5 className="font-serif italic font-medium text-xs text-[#2d2a26] mt-1.5 break-words">
                              {evt.title}
                            </h5>
                            {evt.description && (
                              <p className="text-[11px] text-[#2d2a26]/60 mt-1 break-words">
                                {evt.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => onDeleteEvent(evt.id)}
                            className="p-1 text-[#2d2a26]/40 hover:text-rose-500 hover:bg-rose-500/5 rounded transition-colors cursor-pointer flex-shrink-0"
                            title="Delete event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Side: Quick Add Event form */}
              <div className="space-y-3 flex flex-col justify-between" id="modal-add-form-container">
                <h4 className="font-sans font-semibold text-[#2d2a26]/50 text-[11px] uppercase tracking-widest border-b border-[#b08b46]/10 pb-1.5">
                  Quick Add Event
                </h4>
                <form onSubmit={handleFormSubmit} className="space-y-3.5 flex-1 mt-1">
                  <div className="space-y-1">
                    <label className="text-[9px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">Event Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Run 5km, Gym workout, Cook dinner"
                      className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-xs text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                      required
                      id="modal-event-title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">Time (optional)</label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-1.5 text-xs text-[#2d2a26] focus:outline-none transition-colors cursor-pointer"
                        id="modal-event-time"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">Type / Category</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-1.5 text-xs text-[#2d2a26] focus:outline-none transition-colors cursor-pointer"
                        id="modal-event-type"
                      >
                        {EVENT_TYPES.map((t) => (
                          <option key={t.value} value={t.value} className="bg-[#ffffff]">
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-sans font-semibold text-[#2d2a26]/40 uppercase tracking-widest block">Description (optional)</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add details, link, or notes..."
                      className="w-full bg-[#faf8f5] border border-[#b08b46]/15 focus:border-[#b08b46] rounded-xl px-3 py-2 text-xs text-[#2d2a26] placeholder-[#2d2a26]/30 focus:outline-none transition-colors"
                      id="modal-event-desc"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#b08b46] hover:bg-[#b08b46]/90 active:bg-[#b08b46]/80 text-[#ffffff] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2 shadow-xs"
                    id="modal-event-add-btn"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Event
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

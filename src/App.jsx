import { useEffect, useState } from 'react';
import { Check, CheckCheck, ClipboardList, Moon, Sun, Sparkles } from 'lucide-react';
import useLocalStorage from './hooks/useLocalStorage';
import TodoInput from './components/TodoInput';
import TodoItem from './components/TodoItem';
import Filters from './components/Filters';

const validTodos = value => Array.isArray(value) && value.every(todo => todo && typeof todo.id === 'string' && typeof todo.text === 'string' && typeof todo.completed === 'boolean');

export default function App() {
  const [todos, setTodos, storageError] = useLocalStorage('wannee-todos', [], validTodos);
  const [theme, setTheme, themeError] = useLocalStorage('wannee-theme', () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', value => value === 'dark' || value === 'light');
  const [filter, setFilter] = useState('all');
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  const completed = todos.filter(todo => todo.completed).length;
  const remaining = todos.length - completed;
  const visible = todos.filter(todo => filter === 'all' || (filter === 'completed' ? todo.completed : !todo.completed));
  const date = new Intl.DateTimeFormat('th-TH', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  function addTodo(text) {
    setTodos(previous => [...previous, { id: crypto.randomUUID(), text, completed: false }]);
    setFilter('all');
    setAnnouncement(`เพิ่มงาน ${text} แล้ว`);
  }
  function removeTodo(id) {
    setTodos(previous => previous.filter(todo => todo.id !== id));
    setAnnouncement('ลบงานแล้ว');
  }
  return (
    <main className="min-h-dvh flex items-center justify-center px-5 py-20 sm:px-6">
      <button className="theme-button" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'} title={theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}>
        {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
      </button>
      <div className="w-full max-w-[480px] page-enter">
        <header className="mb-7 flex items-center gap-2.5 px-1">
          <span className="brand-icon"><Check size={17} strokeWidth={2.8} /></span>
          <span className="brand-name">วันนี้<span className="brand-dot">.</span></span>
          <span className="brand-tagline">ทีละงาน ในจังหวะของคุณ</span>
        </header>
        <section className="todo-card" aria-labelledby="page-title">
          <div className="card-top">
            <div className="flex items-center justify-between gap-3">
              <p className="date-label">{date}</p>
              <span className="today-badge"><span />วันใหม่ เริ่มได้เสมอ</span>
            </div>
            <h1 id="page-title">พื้นที่เล็ก ๆ ของวันนี้</h1>
            <p className="subtitle">จดสิ่งที่ต้องทำ แล้วค่อย ๆ ทำให้สำเร็จ</p>
            <TodoInput onAdd={addTodo} />
          </div>
          <Filters value={filter} onChange={setFilter} counts={{ all: todos.length, active: remaining, completed }} />
          <div className="list-area">
            {visible.length ? (
              <ul aria-label="รายการงาน">
                {visible.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={id => setTodos(previous => previous.map(item => item.id === id ? { ...item, completed: !item.completed } : item))} onEdit={(id, text) => setTodos(previous => previous.map(item => item.id === id ? { ...item, text } : item))} onRemove={removeTodo} />)}
              </ul>
            ) : (
              <div className="empty-state">
                <div className="empty-art"><span className="art-orbit" /><span className="art-paper">{filter === 'active' && todos.length ? <CheckCheck size={29} strokeWidth={1.4} /> : <ClipboardList size={29} strokeWidth={1.4} />}</span><Sparkles className="art-sparkle" size={17} strokeWidth={1.5} /></div>
                <h2>{filter === 'completed' ? 'งานที่สำเร็จจะอยู่ตรงนี้' : filter === 'active' && todos.length ? 'ทำครบทุกงานแล้ว เก่งมาก!' : 'วันนี้ยังไม่มีงาน'}</h2>
                <p>{filter === 'completed' ? 'ทุกงานเล็ก ๆ ที่ทำเสร็จ มีความหมายเสมอ' : filter === 'active' && todos.length ? 'พักสักนิด แล้วค่อยเริ่มสิ่งใหม่ก็ได้นะ' : 'เริ่มเพิ่มงานแรก แล้วทำวันนี้ให้เป็นวันดี ๆ'}</p>
              </div>
            )}
          </div>
          <footer className="card-footer">
            <span className="remaining"><span className="status-dot" />เหลืออีก <strong>{remaining}</strong> งาน</span>
            <button className="clear-button" type="button" disabled={!completed} onClick={() => { setTodos(previous => previous.filter(todo => !todo.completed)); setAnnouncement('ล้างงานที่เสร็จแล้ว'); }}>ล้างงานที่เสร็จแล้ว</button>
          </footer>
        </section>
        <p className="usage-hint">กด <kbd>Enter</kbd> เพื่อเพิ่มงาน<span>·</span>ดับเบิลคลิกที่ข้อความเพื่อแก้ไข</p>
        <p className="save-note">{storageError || themeError ? 'บันทึกไม่ได้ในขณะนี้ โปรดเปิดใช้งานพื้นที่จัดเก็บของเบราว์เซอร์' : 'พื้นที่ของคุณ บันทึกอัตโนมัติในเบราว์เซอร์นี้'}</p>
      </div>
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    </main>
  );
}

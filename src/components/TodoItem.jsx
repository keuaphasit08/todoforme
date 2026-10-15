import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onEdit, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const [removing, setRemoving] = useState(false);
  const timer = useRef();
  const canceled = useRef(false);
  const input = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (editing) input.current?.select(); }, [editing]);

  function save() {
    if (canceled.current) return;
    if (draft.trim()) onEdit(todo.id, draft.trim());
    setEditing(false);
  }
  function remove() {
    setRemoving(true);
    timer.current = setTimeout(() => onRemove(todo.id), 180);
  }
  return (
    <li className={`todo-item group ${todo.completed ? 'completed' : ''} ${removing ? 'removing' : ''}`}>
      <button type="button" className="check-button" onClick={() => onToggle(todo.id)} aria-label={`${todo.completed ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}: ${todo.text}`} aria-pressed={todo.completed}>
        {todo.completed && <Check size={13} strokeWidth={2.6} />}
      </button>
      {editing ? (
        <input ref={input} className="edit-input" aria-label="แก้ไขงาน" value={draft} maxLength={500} onChange={event => setDraft(event.target.value)} onBlur={save} onKeyDown={event => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === 'Enter') { event.preventDefault(); save(); }
          if (event.key === 'Escape') { canceled.current = true; setEditing(false); }
        }} />
      ) : (
        <span className="todo-text" tabIndex={0} role="button" aria-label={`แก้ไขงาน: ${todo.text}`} title="ดับเบิลคลิกเพื่อแก้ไข หรือกด Enter" onDoubleClick={() => { canceled.current = false; setDraft(todo.text); setEditing(true); }} onKeyDown={event => {
          if (event.key === 'Enter' || event.key === 'F2') { event.preventDefault(); canceled.current = false; setDraft(todo.text); setEditing(true); }
        }}>{todo.text}</span>
      )}
      <button type="button" className="delete-button" onClick={remove} disabled={removing} aria-label={`ลบงาน: ${todo.text}`} title="ลบงาน"><X size={16} /></button>
    </li>
  );
}

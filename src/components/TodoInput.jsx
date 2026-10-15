import { useState } from 'react';
import { Plus, CornerDownLeft } from 'lucide-react';

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('');
  function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  }
  return (
    <form onSubmit={submit} className="new-todo">
      <Plus size={20} strokeWidth={1.7} aria-hidden="true" />
      <input aria-label="งานใหม่" placeholder="วันนี้อยากทำอะไรให้สำเร็จ?" value={text} onChange={event => setText(event.target.value)} onKeyDown={event => {
        if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault();
      }} maxLength={500} />
      <button type="submit" className="enter-button" aria-label="เพิ่มงาน" title="กด Enter เพื่อเพิ่มงาน"><CornerDownLeft size={17} /></button>
    </form>
  );
}

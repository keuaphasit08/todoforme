import { useEffect, useState } from 'react';

export default function useLocalStorage(key, initialValue, validate = () => true) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (validate(parsed)) return parsed;
      }
    } catch { /* ใช้ค่าเริ่มต้นหากข้อมูลเดิมเสียหายหรืออ่านไม่ได้ */ }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError(false);
    } catch { setStorageError(true); }
  }, [key, value]);

  return [value, setValue, storageError];
}

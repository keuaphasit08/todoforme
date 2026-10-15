const filters = [['all', 'ทั้งหมด'], ['active', 'ยังไม่เสร็จ'], ['completed', 'เสร็จแล้ว']];

export default function Filters({ value, onChange, counts }) {
  return (
    <div className="filters" role="group" aria-label="กรองงาน">
      {filters.map(([key, label]) => (
        <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} className={value === key ? 'filter selected' : 'filter'}>
          {label}<span className="filter-count">{counts[key]}</span>
        </button>
      ))}
    </div>
  );
}

import { Trash2Icon } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Column } from '../types';

type ColumnContentProps = {
  column: Column;
  deleteColumn: (id: string) => void;
};

export const ColumnContent = ({ column, deleteColumn }: ColumnContentProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 border-orange-500 rounded-md max-h-[600px] w-[250px] h-[400px] flex flex-col p-2 bg-orange-100"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-2 border-black rounded-md max-h-[600px] w-[250px] h-[400px] flex flex-col p-2 bg-slate-100"
    >
      {/* title */}
      <div
        className="p-4 bg-slate-300 text-black rounded-md flex gap-2 items-center justify-between select-none"
        {...listeners}
        {...attributes}
      >
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center p-2 text-sm">0</div>
          {column.title}
        </div>
        <button className="bg-black text-white p-2 rounded-md" onClick={() => deleteColumn(column.id)}>
          <Trash2Icon size={16} />
        </button>
      </div>

      {/* tasks */}
      <div className="flex-1">tasks</div>

      {/* footer */}
      <div>footer</div>
    </div>
  );
};

import { useSortable } from '@dnd-kit/sortable';
import { Trash2Icon } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';

import { Column } from '../types';

type ColumnContentProps = {
  column: Column;
  deleteColumn: (id: string) => void;
};

function ColumnContent({ column, deleteColumn }: ColumnContentProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 border-orange-500 rounded-md w-[350px] h-[400px] max-h-[400px] flex flex-col p-2 bg-orange-100"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md w-[350px] min-w-[350px] h-[400px] max-h-[400px] flex flex-col p-2 border-slate-300 border-2 bg-slate-100"
    >
      {/* Header column */}
      <div
        {...listeners}
        {...attributes}
        className="p-4 bg-slate-300 text-black rounded-md h-16 flex gap-2 items-center justify-between select-none cursor-grab"
      >
        {/* title with count */}
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-orange-500 text-white h-8 w-8 text-sm rounded-full">
            0
          </div>
          {column.title}
        </div>
        {/* button delete column */}
        <button
          className="bg-slate-200 text-slate-500 p-2 rounded-md hover:bg-white"
          onClick={() => deleteColumn(column.id)}
        >
          <Trash2Icon size={18} />
        </button>
      </div>

      {/* Tasks */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">tasks</div>

      {/* footer */}
      <div>footer</div>
    </div>
  );
}

export default ColumnContent;

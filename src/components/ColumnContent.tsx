import { useMemo, useState } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { PlusCircleIcon, Trash2Icon } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';

import { Column, Task } from '../types';
import { TaskCard } from './TaskCard';

type ColumnContentProps = {
  column: Column;
  deleteColumn: (id: string) => void;
  updateColumn: (id: string, title: string) => void;
  createTask: (id: string) => void;
  tasks: Task[];
  deleteTask: (id: string) => void;
  updateTask: (id: string, content: string) => void;
};

const ColumnContent = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: ColumnContentProps) => {
  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const [editMode, setEditMode] = useState(false);
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
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
        onClick={() => setEditMode(true)}
      >
        {/* title with count */}
        <div className="flex gap-2 items-center">
          <span className="flex justify-center items-center bg-orange-500 text-white h-8 w-8 text-sm rounded-full">
            0
          </span>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-white border-2 focus:border-orange-500 rounded-md px-2 py-1 outline-none"
              value={column.title}
              autoFocus
              onBlur={() => setEditMode(false)}
              onChange={(e) => updateColumn(column.id, e.target.value)}
            />
          )}
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
      <div className="flex flex-grow flex-col gap-2 my-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksId}>
          {tasks &&
            tasks.map((task) => <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />)}
        </SortableContext>
      </div>

      {/* footer */}
      <div>
        <button
          className="rounded-lg p-3 bg-slate-500 text-white flex items-center gap-2 active:translate-y-1 transition-transform active:scale-95 w-full hover:bg-slate-700"
          onClick={() => createTask(column.id)}
        >
          <PlusCircleIcon />
          <span className="font-bold text-sm">Add New Task</span>
        </button>
      </div>
    </div>
  );
};

export { ColumnContent };

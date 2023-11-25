import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Trash2Icon } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';

import { Task } from '../types';

type TaskCardProps = {
  task: Task;
  deleteTask: (id: string) => void;
  updateTask: (id: string, content: string) => void;
};

const TaskCard = ({ task, deleteTask, updateTask }: TaskCardProps) => {
  const [editMode, setEditMode] = useState(false);
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
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
        className="border-2 border-orange-500 rounded-md min-h-[100px] flex flex-col p-2 bg-orange-100"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-slate-200 rounded-md flex relative min-h-[100px] cursor-grab"
      onMouseOver={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div
        className="text-sm text-slate-500 w-full"
        onClick={() => {
          setEditMode(true);
          setMouseIsOver(false);
        }}
      >
        {!editMode && <p className="h-16 overflow-y-scroll">{task.content}</p>}

        {editMode && (
          <textarea
            className="bg-white border-2 focus:border-orange-500 rounded-md px-2 py-1 outline-none w-full h-full"
            value={task.content}
            onChange={(e) => updateTask(task.id, e.target.value)}
            autoFocus
            onBlur={() => {
              setEditMode(false);
              setMouseIsOver(false);
            }}
          ></textarea>
        )}
      </div>
      {!editMode && mouseIsOver && (
        <button
          className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-500 active:scale-95 transition-transform p-2 bg-slate-300 rounded-md"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2Icon size={16} />
        </button>
      )}
    </div>
  );
};

export { TaskCard };

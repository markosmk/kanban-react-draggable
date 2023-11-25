import { Trash2Icon } from 'lucide-react';
import { Task } from '../types';

type TaskCardProps = {
  task: Task;
  deleteTask: (id: string) => void;
};

const TaskCard = ({ task, deleteTask }: TaskCardProps) => {
  return (
    <div className="p-4 bg-slate-200 rounded-md flex relative group">
      <div className="text-sm text-slate-500">{task.content}</div>
      <button
        className="absolute invisible group-hover:visible top-1/2 -translate-y-1/2 right-3 text-slate-500 active:scale-95 transition-transform p-2 bg-slate-300 rounded-md"
        onClick={() => deleteTask(task.id)}
      >
        <Trash2Icon size={16} />
      </button>
    </div>
  );
};

export { TaskCard };

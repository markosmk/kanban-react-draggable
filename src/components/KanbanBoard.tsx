import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { PlusCircleIcon } from 'lucide-react';
import { nanoid } from 'nanoid';

import { Column, Task } from '../types';
import { ColumnContent } from './ColumnContent';
import { TaskCard } from './TaskCard';

const defaultCols: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
  },
  {
    id: 'doing',
    title: 'Work in progress',
  },
  {
    id: 'done',
    title: 'Done',
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  /** TASKS */
  const createTask = (columnId: string) => {
    const newTask: Task = {
      id: nanoid(),
      columnId,
      content: 'Task ' + (tasks.length + 1),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (taskId: string) => {
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(filteredTasks);
  };

  const updateTask = (taskId: string, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, content };
      }
      return task;
    });
    setTasks(newTasks);
  };

  /** COLUMNS */
  const createColumn = () => {
    const newCol: Column = {
      id: nanoid(),
      title: 'Column ' + (columns.length + 1),
    };
    setColumns((prev) => [...prev, newCol]);
  };

  const deleteColumn = (id: string) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  const updateColumn = (id: string, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id === id) {
        return { ...col, title };
      }
      return col;
    });

    setColumns(newColumns);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const activeColumnIdx = columns.findIndex((col) => col.id === active.id);
    const overColumnIdx = columns.findIndex((col) => col.id === over.id);
    const newOrder = arrayMove(columns, activeColumnIdx, overColumnIdx);
    setColumns(newOrder);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    if (active.data.current?.type !== 'Task') return;

    // drop in same context task
    if (active.data.current?.type === 'Task' && over.data.current?.type === 'Task') {
      const activeTaskIdx = tasks.findIndex((task) => task.id === active.id);
      const overTaskIdx = tasks.findIndex((task) => task.id === over.id);

      tasks[activeTaskIdx].columnId = tasks[overTaskIdx].columnId;

      const newOrder = arrayMove(tasks, activeTaskIdx, overTaskIdx);
      setTasks(newOrder);
    }

    // drop in other column
    if (active.data.current?.type === 'Task' && over.data.current?.type === 'Column') {
      const activeTaskIdx = tasks.findIndex((task) => task.id === active.id);

      tasks[activeTaskIdx].columnId = over.id.toString();

      const newOrder = arrayMove(tasks, activeTaskIdx, activeTaskIdx);
      setTasks(newOrder);
    }
  };

  return (
    <div className="flex m-auto min-h-screen w-full items-center px-10 overflow-x-auto overflow-y-hidden">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContent
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContent
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      <div className="absolute top-4 right-4">
        <button
          className="rounded-lg p-3 bg-slate-500 text-white flex items-center gap-2 active:translate-y-1 transition-transform active:scale-95"
          onClick={createColumn}
        >
          <PlusCircleIcon />
          <span className="font-bold text-sm">Add Column</span>
        </button>
      </div>
    </div>
  );
};

export { KanbanBoard };

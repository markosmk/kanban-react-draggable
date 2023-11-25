import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { PlusCircleIcon } from 'lucide-react';
import { nanoid } from 'nanoid';

import { Column } from '../types';
import { ColumnContent } from './ColumnContent';

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const activeColumnIdx = columns.findIndex((col) => col.id === active.id);
    const overColumnIdx = columns.findIndex((col) => col.id === over.id);
    const newOrder = arrayMove(columns, activeColumnIdx, overColumnIdx);
    setColumns(newOrder);
  };

  return (
    <div className="flex m-auto min-h-screen w-full items-center px-10 overflow-x-auto overflow-y-hidden">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContent key={col.id} column={col} deleteColumn={deleteColumn} />
              ))}
            </SortableContext>
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && <ColumnContent column={activeColumn} deleteColumn={deleteColumn} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      <div className="absolute top-4 right-4">
        <button
          className="rounded-lg p-3 bg-slate-500 text-white flex items-center gap-2 active:translate-y-1 transition-transform  active:scale-95"
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

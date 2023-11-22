import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { PlusCircleIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

import { Column } from '../types';
import { ColumnContent } from './ColumnContent';

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
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

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  };

  return (
    <>
      <div className="flex m-auto min-h-screen w-full items-center justify-center px-10 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <div className="flex gap-4 m-auto mb-4">
            <SortableContext items={columnsId}>
              {columns.map((col, idx) => (
                <ColumnContent key={idx} column={col} deleteColumn={deleteColumn} />
              ))}
            </SortableContext>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && <ColumnContent column={activeColumn} deleteColumn={deleteColumn} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
      <button className="rounded-lg border-2 p-4 bg-black text-white font-bold flex gap-2" onClick={createColumn}>
        <PlusCircleIcon />
        Add Column
      </button>
    </>
  );
};

import React from 'react';

interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  location: string;
}

interface FloorMapProps {
  availableTables: Table[];
  selectedTableId: string;
  onSelectTable: (id: string) => void;
}

export const FloorMap: React.FC<FloorMapProps> = ({ availableTables, selectedTableId, onSelectTable }) => {
  // We mock the positions to look like a real "Movie Theater" or "Restaurant Floor"
  // Group tables by location for semantic grouping
  const locations = Array.from(new Set(availableTables.map((t) => t.location)));

  return (
    <div className="bg-surface-container p-8 rounded-lg shadow-inner overflow-hidden mb-8 border border-outline-variant/30">
      <div className="text-center mb-8">
        <h4 className="headline text-on-surface text-xl">The Digital Maître d’ - Main Floor</h4>
        <p className="text-sm uppercase tracking-widest text-on-surface-variant mt-2">Eagle Eye View</p>
      </div>
      
      <div className="flex flex-col gap-12">
        {locations.map((loc) => {
          const locTables = availableTables.filter((t) => t.location === loc);
          return (
            <div key={loc} className="bg-surface-container-low p-6 rounded-md border border-outline-variant/10 shadow-luxury-ambient relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-highest px-4 py-1 text-xs uppercase tracking-widest rounded-full text-on-surface-variant">
                {loc}
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 mt-4">
                {locTables.map((table) => {
                  const isSelected = selectedTableId === table._id;
                  return (
                    <button
                      key={table._id}
                      onClick={() => onSelectTable(table._id)}
                      className={`relative flex flex-col items-center justify-center w-24 h-24 rounded-full transition-all duration-300
                        ${isSelected 
                          ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(var(--color-primary),0.6)] scale-125 ring-4 ring-offset-4 ring-primary z-10 font-bold' 
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-highest border border-outline-variant/30 hover:scale-105'
                        }`}
                    >
                      <div className="font-bold headline">T{table.tableNumber}</div>
                      <div className="text-[0.6875rem] uppercase tracking-widest mt-1 opactiy-80">
                        {table.capacity} Seats
                      </div>
                      
                      {/* Decorative "Seats" around table */}
                      <div className="absolute -top-2 w-3 h-1 bg-outline-variant/40 rounded-full"></div>
                      <div className="absolute -bottom-2 w-3 h-1 bg-outline-variant/40 rounded-full"></div>
                      {table.capacity >= 4 && (
                        <>
                          <div className="absolute -left-2 w-1 h-3 bg-outline-variant/40 rounded-full"></div>
                          <div className="absolute -right-2 w-1 h-3 bg-outline-variant/40 rounded-full"></div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

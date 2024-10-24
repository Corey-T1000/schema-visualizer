import React from 'react';
import { useSchemaStore } from '../store/schemaStore';
import type { Definition } from '../types/schema';

export function Controls() {
  const { schema, setFilteredDefinitions } = useSchemaStore();
  
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredDefinitions(schema.definitions);
      return;
    }
    
    const filtered = schema.definitions.filter((def: Definition) => 
      def.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.relations.some((rel) => 
        rel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rel.type.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      def.permissions.some((perm) => 
        perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.expression.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    setFilteredDefinitions(filtered);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filterType = event.target.value;
    
    switch (filterType) {
      case 'all':
        setFilteredDefinitions(schema.definitions);
        break;
      case 'with-permissions':
        setFilteredDefinitions(schema.definitions.filter((def: Definition) => def.permissions.length > 0));
        break;
      case 'with-relations':
        setFilteredDefinitions(schema.definitions.filter((def: Definition) => def.relations.length > 0));
        break;
      case 'root-nodes':
        setFilteredDefinitions(schema.definitions.filter((def: Definition) => 
          !schema.definitions.some((otherDef: Definition) => 
            otherDef.relations.some((rel) => 
              rel.type.split('|').some((t) => t.trim().split('#')[0] === def.name)
            )
          )
        ));
        break;
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg space-y-4">
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          id="search"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search entities, relations, permissions..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
          Filter
        </label>
        <select
          id="filter"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          onChange={handleFilterChange}
          defaultValue="all"
        >
          <option value="all">All Entities</option>
          <option value="with-permissions">With Permissions</option>
          <option value="with-relations">With Relations</option>
          <option value="root-nodes">Root Nodes</option>
        </select>
      </div>
    </div>
  );
}

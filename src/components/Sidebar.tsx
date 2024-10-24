import React, { useState } from 'react';
import { useSchemaStore } from '../store/schemaStore';
import type { Definition, Schema } from '../types/schema';

export function Sidebar() {
  const { schema, setFilteredDefinitions, setSchema } = useSchemaStore();
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'search' | 'schema'>('search');
  const [importError, setImportError] = useState<string | null>(null);
  
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

  const validateSchema = (schema: unknown): schema is Schema => {
    if (typeof schema !== 'object' || !schema) return false;
    if (!('definitions' in schema) || !Array.isArray((schema as Schema).definitions)) return false;
    return true;
  };

  const handleSchemaImport = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsed = JSON.parse(event.target.value);
      if (validateSchema(parsed)) {
        setSchema(parsed);
        setImportError(null);
      } else {
        setImportError('Invalid schema format: must contain definitions array');
      }
    } catch {
      setImportError('Invalid JSON format');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (validateSchema(parsed)) {
            setSchema(parsed);
            setImportError(null);
          } else {
            setImportError('Invalid schema format: must contain definitions array');
          }
        } catch {
          setImportError('Invalid schema file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full transition-all duration-300
        ${isOpen ? 'w-96' : 'w-12'}`}
      style={{ zIndex: 9999 }}
    >
      <div className="relative h-full">
        {/* Backdrop with high z-index */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg border-r border-white/20"
          style={{ zIndex: 9998 }}
        />

        {/* Content with highest z-index */}
        <div className="relative" style={{ zIndex: 9999 }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-slate-900/60 backdrop-blur-lg rounded-full p-1.5 shadow-xl border border-white/20 hover:bg-slate-800/60"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 text-white/90 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="h-full flex flex-col p-4 text-white/90">
              <div className="flex space-x-2 mb-4">
                <button
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors duration-200 ${
                    activeTab === 'search'
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-transparent border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab('search')}
                >
                  Search & Filter
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors duration-200 ${
                    activeTab === 'schema'
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-transparent border-white/10 text-white/70 hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab('schema')}
                >
                  Schema
                </button>
              </div>

              {activeTab === 'search' ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-white/80 mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      id="search"
                      className="block w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                      placeholder="Search entities, relations, permissions..."
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="filter" className="block text-sm font-medium text-white/80 mb-1">
                      Filter
                    </label>
                    <select
                      id="filter"
                      className="block w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
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
              ) : (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex-1">
                    <label htmlFor="schema" className="block text-sm font-medium text-white/80 mb-1">
                      Current Schema
                    </label>
                    <textarea
                      id="schema"
                      className="block w-full h-[calc(100%-2rem)] bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent"
                      value={JSON.stringify(schema, null, 2)}
                      onChange={handleSchemaImport}
                      placeholder="Paste your schema here..."
                      spellCheck="false"
                    />
                  </div>
                  
                  {importError && (
                    <div className="text-red-300 text-sm bg-red-900/20 border border-red-500/20 p-3 rounded-lg">
                      {importError}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-white/80 mb-1">
                      Import Schema File
                    </label>
                    <input
                      type="file"
                      id="file-upload"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-white/70
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border file:border-white/10
                        file:text-sm file:font-medium
                        file:bg-white/5 file:text-white
                        hover:file:bg-white/10
                        focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

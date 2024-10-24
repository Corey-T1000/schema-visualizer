import { create } from 'zustand';
import type { Schema, Definition } from '../types/schema';

interface SchemaState {
  schema: Schema;
  filteredDefinitions: Definition[];
  selectedDefinition: string | null;
  hoveredDefinition: string | null;
  setSchema: (schema: Schema) => void;
  setFilteredDefinitions: (definitions: Definition[]) => void;
  setSelectedDefinition: (name: string | null) => void;
  setHoveredDefinition: (name: string | null) => void;
  updateNodePosition: (name: string, position: [number, number, number]) => void;
}

export const useSchemaStore = create<SchemaState>((set) => ({
  schema: {
    definitions: [
      {
        name: 'user',
        relations: [],
        permissions: [],
      },
      {
        name: 'group',
        relations: [
          { name: 'member', type: 'user | group#member' },
        ],
        permissions: [
          { name: 'view', expression: 'member' },
          { name: 'admin', expression: 'member' },
        ],
      },
      {
        name: 'folder',
        relations: [
          { name: 'owner', type: 'user | group#member' },
          { name: 'editor', type: 'user | group#member' },
          { name: 'viewer', type: 'user | group#member' },
          { name: 'parent', type: 'folder' },
        ],
        permissions: [
          { name: 'view', expression: 'viewer + editor + owner + parent->view' },
          { name: 'edit', expression: 'editor + owner + parent->edit' },
          { name: 'admin', expression: 'owner + parent->admin' },
          { name: 'share', expression: 'admin + edit' },
        ],
      },
      {
        name: 'document',
        relations: [
          { name: 'owner', type: 'user | group#member' },
          { name: 'editor', type: 'user | group#member' },
          { name: 'viewer', type: 'user | group#member' },
          { name: 'commenter', type: 'user | group#member' },
          { name: 'parent_folder', type: 'folder' },
        ],
        permissions: [
          { name: 'view', expression: 'viewer + commenter + editor + owner + parent_folder->view' },
          { name: 'comment', expression: 'commenter + editor + owner + parent_folder->edit' },
          { name: 'edit', expression: 'editor + owner + parent_folder->edit' },
          { name: 'delete', expression: 'owner + parent_folder->admin' },
          { name: 'share', expression: 'owner + parent_folder->share' },
          { name: 'create_version', expression: 'edit' },
          { name: 'restore_version', expression: 'edit' },
        ],
      },
      {
        name: 'comment',
        relations: [
          { name: 'author', type: 'user' },
          { name: 'parent_document', type: 'document' },
        ],
        permissions: [
          { name: 'view', expression: 'parent_document->view' },
          { name: 'edit', expression: 'author + parent_document->admin' },
          { name: 'delete', expression: 'edit' },
        ],
      },
      {
        name: 'team',
        relations: [
          { name: 'owner', type: 'user' },
          { name: 'admin', type: 'user | group#member' },
          { name: 'member', type: 'user | group#member' },
        ],
        permissions: [
          { name: 'view', expression: 'member + admin + owner' },
          { name: 'manage_members', expression: 'admin + owner' },
          { name: 'manage_settings', expression: 'admin + owner' },
          { name: 'delete', expression: 'owner' },
        ],
      },
      {
        name: 'workspace',
        relations: [
          { name: 'owner', type: 'user | team#owner' },
          { name: 'admin', type: 'user | team#admin' },
          { name: 'member', type: 'user | team#member' },
        ],
        permissions: [
          { name: 'view', expression: 'member + admin + owner' },
          { name: 'create_folder', expression: 'member + admin + owner' },
          { name: 'create_document', expression: 'member + admin + owner' },
          { name: 'manage_members', expression: 'admin + owner' },
          { name: 'manage_settings', expression: 'admin + owner' },
          { name: 'delete', expression: 'owner' },
        ],
      },
    ],
  },
  filteredDefinitions: [], // Will be initialized with all definitions
  selectedDefinition: null,
  hoveredDefinition: null,
  setSchema: (schema) => set({ 
    schema,
    filteredDefinitions: schema.definitions 
  }),
  setFilteredDefinitions: (definitions) => set({ filteredDefinitions: definitions }),
  setSelectedDefinition: (name) => set({ selectedDefinition: name }),
  setHoveredDefinition: (name) => set({ hoveredDefinition: name }),
  updateNodePosition: (name, position) => set((state) => ({
    filteredDefinitions: state.filteredDefinitions.map(def => 
      def.name === name ? { ...def, position } : def
    )
  })),
}));

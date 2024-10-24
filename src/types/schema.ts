export interface Permission {
  name: string;
  expression: string;
}

export interface Relation {
  name: string;
  type: string;
}

export interface Definition {
  name: string;
  relations: Relation[];
  permissions: Permission[];
  position?: [number, number, number];
}

export interface Schema {
  definitions: Definition[];
}

export interface RelationshipLink {
  from: string;
  to: string;
  type: string;
  relation: string;
}
import { WellModel } from '../model/wellModel';

export enum NodeType {
  Field,
  Battery,
  Pad,
  Wells
}

export class Node{
  type: NodeType;
  name: string;
  children?: Node[];
  isOn?: boolean;
  nodeId: number;
  nodeParentId?: number;
}

export class FlatNode {
  type: NodeType;
  name: string;
  isOn?: boolean;
  id: string;
  level: number;
  expandable: boolean;
}

export class SavedState {
  Name: string;
  SelectedNode: Node[];
  SavedText: string;
  SavedOption: string;
}

export interface WellHierarchyResult {
  hierarchy: Node[]
}
import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { FormsModule } from '@angular/forms';
import { WellTreeView } from './well-tree-view.component';
import { HttpClientModule } from '@angular/common/http';
import { HierarchyService } from '../../../services/HierarchyService';
import { TreeViewService } from '../../../services/tree-view.service';
import { WellsService } from '../../../services/wells.service';
import { WellTreeListComponent } from '../well-tree-list.component';
import { SavedState, Node, NodeType, FlatNode } from '../../../services/models';
import { NestedTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { of } from 'rxjs';

describe('WellTreeView', () => {
  let component: WellTreeView;
  let fixture: ComponentFixture<WellTreeView>;
  let service: HierarchyService;
  let treeService : TreeViewService;
  const mockGetParentNode = jasmine.createSpy('getParentNode');
  const mockChecklistSelection = jasmine.createSpyObj('ChecklistSelection', ['toggle']); // Create a spy for ChecklistSelection
  const mockCheckAllParentsSelection = jasmine.createSpy('checkAllParentsSelection');
  const mockUpdateSelectedCheckList = jasmine.createSpy('updateSelectedCheckList');
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellTreeView],
      imports:[MatDialogModule,HttpClientModule,MatSlideToggleModule,MatCheckboxModule, MatTreeModule, FormsModule],
      providers:[TreeViewService,HierarchyService,WellsService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellTreeView);
    component = fixture.componentInstance;
    service = TestBed.inject(HierarchyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should expand nodes until it reaches a Pad node', () => {
    const padNode: Node = { nodeId: 1, name: 'Pad Node', type: NodeType.Pad };
    const nonPadNode1: Node = { nodeId: 2, name: 'Non-Pad Node 1', type: NodeType.Field };
    const nonPadNode2: Node = { nodeId: 3, name: 'Non-Pad Node 2', type: NodeType.Field };
    const parentNode: Node = {
      nodeId: 4,
      name: 'Parent Node',
      type: NodeType.Field,
      children: [nonPadNode1, nonPadNode2],
    };

    component.expandTillPad([padNode, parentNode]);

  });

  it('should handle an empty input array', () => {
    const result = component.expandTillPad([]);
  });

  it('should return the children of a node', () => {
    const parentNode = {
      nodeId: 1,
      name: 'Parent Node',
      children: [
        { nodeId: 2, name: 'Child 1' },
        { nodeId: 3, name: 'Child 2' },
      ],
    };

    const result = component.GetChildren(parentNode);

    expect(result).toEqual(parentNode.children);
  });

  it('should handle a node without children', () => {
    const leafNode = { nodeId: 4, name: 'Leaf Node' };

    const result = component.GetChildren(leafNode);

    expect(result).toBeUndefined();
  });

  it('should initialize treeControl with the correct configuration', () => {
    const expectedTreeControl = new NestedTreeControl<Node>(component.GetChildren);
  
    expect(component.treeControl.getDescendants).toBe(expectedTreeControl.getDescendants);
    expect(component.treeControl.isExpandable).toBe(expectedTreeControl.isExpandable);
  });

  it('should return true for non-well nodes', () => {
    const nonWellNode: FlatNode = { type: NodeType.Field, name: 'Field', id: '1', level: 1, expandable: true };
    const result = component.notWellNode(nonWellNode);

    expect(result).toBe(true);
  });

  it('should return false for well nodes', () => {
    const wellNode: FlatNode = { type: NodeType.Wells, name: 'Well', id: '2', level: 1, expandable: false };
    const result = component.notWellNode(wellNode);

    expect(result).toBe(false);
  });

  it('should return true for other non-well node types', () => {
    const padNode: FlatNode = { type: NodeType.Pad, name: 'Pad', id: '3', level: 1, expandable: true };
    const batteryNode: FlatNode = { type: NodeType.Battery, name: 'Battery', id: '4', level: 1, expandable: true };
    const resultPad = component.notWellNode(padNode);
    const resultBattery = component.notWellNode(batteryNode);

    expect(resultPad).toBe(true);
    expect(resultBattery).toBe(true);
  });


  it('should return true for NodeType.Pad', () => {
    const padNode: FlatNode = { type: NodeType.Pad, name: 'Pad', id: '1', level: 1, expandable: true };
    const result = component.isCheckbox(padNode);

    expect(result).toBe(true);
  });

  it('should return true for NodeType.Wells', () => {
    const wellsNode: FlatNode = { type: NodeType.Wells, name: 'Wells', id: '2', level: 1, expandable: true };
    const result = component.isCheckbox(wellsNode);

    expect(result).toBe(true);
  });

  it('should return false for other node types', () => {
    const fieldNode: FlatNode = { type: NodeType.Field, name: 'Field', id: '3', level: 1, expandable: true };
    const batteryNode: FlatNode = { type: NodeType.Battery, name: 'Battery', id: '4', level: 1, expandable: true };
    const resultField = component.isCheckbox(fieldNode);
    const resultBattery = component.isCheckbox(batteryNode);

    expect(resultField).toBe(false);
    expect(resultBattery).toBe(false);
  });


  it('should return true if node has children', () => {
    const nodeWithChildren: Node = {
      nodeId: 1,
      nodeParentId: 10,
      name: 'Node 1',
      type: NodeType.Battery,
      children: [{ nodeId: 2, nodeParentId: 1, name: 'Child Node', type: NodeType.Battery }],
    };
    const result = component.hasChild(0, nodeWithChildren);
    expect(result).toBe(true);
  });

  it('should return false if node has no children', () => {
    const nodeWithoutChildren: Node = {
      nodeId: 1,
      nodeParentId: 10,
      name: 'Node 1',
      type: NodeType.Battery,
      children: [],
    };
    const result = component.hasChild(0, nodeWithoutChildren);
    expect(result).toBe(false);
  });

  it('should return false if node.children is null', () => {
    const nodeWithNullChildren: Node = {
      nodeId: 1,
      nodeParentId: 10,
      name: 'Node 1',
      type: NodeType.Battery,
      children: null,
    };
    const result = component.hasChild(0, nodeWithNullChildren);
    expect(result).toBe(false);
  });

  it('should return false if node.children is undefined', () => {
    const nodeWithUndefinedChildren: Node = {
      nodeId: 1,
      nodeParentId: 10,
      name: 'Node 1',
      type: NodeType.Battery,
    };
    const result = component.hasChild(0, nodeWithUndefinedChildren);
    expect(result).toBe(false);
  });

  it('should return true when all descendants are selected', () => {
    const node: Node = {
      nodeId: 1,
      nodeParentId: null,
      name: 'Node 1',
      type: NodeType.Battery,
    };

    spyOn(component.treeControl, 'getDescendants').and.returnValue([
      { nodeId: 2, nodeParentId: 1, name: 'Child 1', type: NodeType.Battery },
      { nodeId: 3, nodeParentId: 1, name: 'Child 2', type: NodeType.Battery },
    ]);

    spyOn(component.checklistSelection, 'isSelected').and.returnValue(true);

    const result = component.descendantsAllSelected(node);

    expect(result).toBe(true);
  });

  it('should return false when not all descendants are selected', () => {
    const node: Node = {
      nodeId: 1,
      nodeParentId: null,
      name: 'Node 1',
      type: NodeType.Battery,
    };

    spyOn(component.treeControl, 'getDescendants').and.returnValue([
      { nodeId: 2, nodeParentId: 1, name: 'Child 1', type: NodeType.Battery },
      { nodeId: 3, nodeParentId: 1, name: 'Child 2', type: NodeType.Battery },
    ]);

    spyOn(component.checklistSelection, 'isSelected').and.returnValues(true, false);

    const result = component.descendantsAllSelected(node);

    expect(result).toBe(false);
  });

  it('should call searchData on hierarchyService with searchText and option', () => {
    const searchText = 'Test';
    const option: NodeType[] = [NodeType.Battery, NodeType.Field]; // Replace with actual nodetypes
    spyOn(service, 'searchData');
    component.searchObj = { searchText, option };
    component.searchData();

    expect(service.searchData).toHaveBeenCalledWith(searchText, option);
  });

  it('should return true when at least one descendant is selected but not all are selected', () => {
    const node: Node = {
      nodeId: 1,
      nodeParentId: null,
      name: 'Node 1',
      type: NodeType.Battery,
    };

    spyOn(component.treeControl, 'getDescendants').and.returnValue([
      { nodeId: 2, nodeParentId: 1, name: 'Child 1', type: NodeType.Battery },
      { nodeId: 3, nodeParentId: 1, name: 'Child 2', type: NodeType.Battery },
    ]);

    spyOn(component.checklistSelection, 'isSelected').and.returnValues(true, false);

    const result = component.descendantsPartiallySelected(node);

    expect(result).toBe(true);
  });

  it('should return false when all descendants are selected', () => {

    const node: Node = {
      nodeId: 1,
      nodeParentId: null,
      name: 'Node 1',
      type: NodeType.Battery,
    };


    spyOn(component.treeControl, 'getDescendants').and.returnValue([
      { nodeId: 2, nodeParentId: 1, name: 'Child 1', type: NodeType.Battery },
      { nodeId: 3, nodeParentId: 1, name: 'Child 2', type: NodeType.Battery },
    ]);


    spyOn(component.checklistSelection, 'isSelected').and.returnValue(true);


    const result = component.descendantsPartiallySelected(node);

    expect(result).toBe(false);
  });

  it('should return false when no descendants are selected', () => {

    const node: Node = {
      nodeId: 1,
      nodeParentId: null,
      name: 'Node 1',
      type: NodeType.Battery,
    };


    spyOn(component.treeControl, 'getDescendants').and.returnValue([
      { nodeId: 2, nodeParentId: 1, name: 'Child 1', type: NodeType.Battery },
      { nodeId: 3, nodeParentId: 1, name: 'Child 2', type: NodeType.Battery },
    ]);


    spyOn(component.checklistSelection, 'isSelected').and.returnValue(false);


    const result = component.descendantsPartiallySelected(node);


    expect(result).toBe(false);
  });


  it('should check all parents for selection', () => {
    const node: Node = {
      nodeId: 1,
      nodeParentId: 2,
      name: 'Node 1',
      type: NodeType.Battery,
    };

    mockGetParentNode.and.callFake((nodeArg) => {
      return nodeArg.nodeParentId ? { nodeId: nodeArg.nodeParentId } as Node : null;
    });

    component.checkAllParentsSelection(node);

    expect(mockGetParentNode.calls.count()).toBe(0); 
  });

  it('should handle the case of no parents', () => {
    const node: Node = {
      nodeId: 1,
      nodeParentId: null,
      name: 'Node 1',
      type: NodeType.Battery,
    };

    mockGetParentNode.and.callFake(() => {
      fail('getParentNode should not be called for a node with no parents');
    });

    component.checkAllParentsSelection(node);

    expect(mockGetParentNode.calls.any()).toBe(false);
  });



  // it('should toggle selection, update parents, and update selected checklist', () => {
  //   const node: Node = {
  //     nodeId: 1,
  //     nodeParentId: 2,
  //     name: 'Node 1',
  //     type: NodeType.Battery,
  //   };
  //   //component.todoLeafItemSelectionToggle(node);
  //   expect(mockChecklistSelection.toggle).toHaveBeenCalledWith(node.nodeId);
  //   expect(mockCheckAllParentsSelection).toHaveBeenCalledWith(node);
  //   expect(mockUpdateSelectedCheckList).toHaveBeenCalled();
  // });


  it('should toggle selection', () => {
    // Arrange: Create a sample node
    const node: Node = {
      nodeId: 1,
      nodeParentId: 2,
      name: 'Node 1',
      type: NodeType.Battery,
    };
  
    component.todoLeafItemSelectionToggle(node);
  });


  it('should toggle selection', () => {
    // Arrange: Create a sample node
    const node: Node = {
      nodeId: 1,
      nodeParentId: 2,
      name: 'Node 1',
      type: NodeType.Battery,
    };
  
    component.checkRootNodeSelection(node);
  });

  it('should return the parent node when found', () => {
    const parentNode: Node = { nodeId: 1, nodeParentId: null, name: 'Parent Node',type: NodeType.Battery };
    const node: Node = { nodeId: 2, nodeParentId: 1, name: 'Child Node',type: NodeType.Battery };
    service.flatnedTree_data = [parentNode, node];

    const result: Node | null = component.getParentNode(node);

    expect(result).toEqual(parentNode);
  });

  it('should return null when node is not found', () => {
    const node: Node = { nodeId: 2, nodeParentId: 1, name: 'Child Node',type: NodeType.Battery };
    service.flatnedTree_data = [node]; // No parent node in the data
    const result: Node | null = component.getParentNode(node);

    expect(result).toBeUndefined();
  });

  it('should select nodes in checklistSelection based on provided nodes', () => {
    const nodesInService: Node[] = [
      { nodeId: 1, name: 'Node 1',type:NodeType.Battery},
      { nodeId: 2, name: 'Node 2',type:NodeType.Battery },
      { nodeId: 3, name: 'Node 3',type:NodeType.Battery },
      // Add more nodes as needed
    ];
    service.flatnedTree_data = nodesInService;

    const nodesToSelect: Node[] = [
      { nodeId: 2, name: 'Node 2',type:NodeType.Battery },
      { nodeId: 3, name: 'Node 3',type:NodeType.Battery },
    ];

    spyOn(component.checklistSelection, 'select');

    component.UpdateTreeSelection(nodesToSelect);

    nodesToSelect.forEach(node => {
      expect(component.checklistSelection.select).toHaveBeenCalledWith(node.nodeId);
    });
  });
  

  // it('should not select any descendants of the given node when the node is deselected and the node has no descendants', () => {
  //   const node = {
  //     nodeId: 1,
  //     descendants: [],
  //   };
  
  //   const checklistSelection = {
  //     deselect: (nodeId: any) => {},
  //   };
  
  //   spyOn(checklistSelection, 'deselect');
  
  //  component. todoItemSelectionToggle(null);
  
  //   expect(checklistSelection.deselect).toHaveBeenCalledWith(1);
  // });

  it('should toggle item selection and select/deselect descendants', () => {
    const sampleNode: Node = {nodeId: 1, name: 'Node 1' ,type:NodeType.Battery};
    const descendants: Node[] = [
      { nodeId: 1, name: 'Node 1' ,type:NodeType.Battery},
      { nodeId: 2, name: 'Node 2' ,type:NodeType.Battery },
      { nodeId: 3, name: 'Node 3' ,type:NodeType.Battery },
    ];

    component.treeControl.dataNodes = [sampleNode, ...descendants];
    component.treeControl.expand(sampleNode);
    component.checklistSelection.select(2); // Pre-select a descendant

    component.todoItemSelectionToggle(sampleNode);

    expect(component.checklistSelection.isSelected(2)).toBe(true); 

  });
  it('should toggle item selection and select/deselect descendants', () => {
    const sampleNode: Node = {nodeId: 1, name: 'Node 1' ,type:NodeType.Battery};
    const descendants: Node[] = [
      { nodeId: 1, name: 'Node 1' ,type:NodeType.Battery},
      { nodeId: 2, name: 'Node 2' ,type:NodeType.Battery },
      { nodeId: 3, name: 'Node 3' ,type:NodeType.Battery },
    ];

    component.treeControl.dataNodes = [sampleNode, ...descendants];
    component.treeControl.expand(sampleNode);
    component.checklistSelection.select(1); // Pre-select a descendant

    component.todoItemSelectionToggle(sampleNode);

    expect(component.checklistSelection.isSelected(2)).toBe(false); 

  });




  

  


  
});

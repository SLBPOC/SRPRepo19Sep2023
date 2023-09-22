import { ComponentFixture, TestBed, async  } from '@angular/core/testing';

import { SaveTreeStateDialog, WellTreeSearchComponent } from './well-tree-search.component';
import { WellsService } from '../../../services/wells.service';
import { TreeViewService } from '../../../services/tree-view.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { SavedState, Node, NodeType } from '../../../services/models';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('WellTreeSearchComponent', () => {
  let component: WellTreeSearchComponent;
  let fixture: ComponentFixture<WellTreeSearchComponent>;
  let treeViewService : TreeViewService;
  let dialog: MatDialog;
  const mockMatSelectChange: MatSelectChange = {
    value: null,
    source: null,
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WellTreeSearchComponent],
      imports:[MatDialogModule,
                MatSlideToggleModule,
              MatCheckboxModule,
            FormsModule],
      providers:[WellsService,
                 TreeViewService,
                 { provide: MatDialogRef, useValue: {} },
                 { provide: MAT_DIALOG_DATA, useValue: {} },
                 {
                  provide: MatDialog,
                  useValue: {
                    open: () => ({
                      afterClosed: () => of('DialogResult'), // Mock the dialogRef and its afterClosed method.
                    }),
                  },
                }, ]
    });
    fixture = TestBed.createComponent(WellTreeSearchComponent);
    component = fixture.componentInstance;
    treeViewService = TestBed.inject(TreeViewService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isSaveEnabled based on selectedNodes', () => {
    const node1: Node = {
      type: NodeType.Field,
      name: 'Node1',
      nodeId: 1,
    };

    const node2: Node = {
      type: NodeType.Battery,
      name: 'Node2',
      nodeId: 2,
    };


    const selectedNodesData = [node1, node2];
    treeViewService.selectedNodes.next(selectedNodesData);


    expect(component.isSaveEnabled).toBe(true);

    treeViewService.selectedNodes.next([]);


    expect(component.isSaveEnabled).toBe(false);


    component.currentSelectedSavedSearch = {
      Name: 'SavedStateName',
      SelectedNode: [],
      SavedText: '',
      SavedOption: '',
    };


    treeViewService.selectedNodes.next(selectedNodesData);


    expect(component.isSaveEnabled).toBe(false);
  });


  // it('should call treeViewService.SaveState and update isSaveEnabled', () => {
  //   component.savedStateName = 'SavedStateName';
  //   component.option = 'newOption';
  //   component.searchText = 'newText';
  //   component.selectedNodes = [];
  //   component.isSaveEnabled = true; 

  //   spyOn(treeViewService, 'SaveState');

  //   component.save();
  //   expect(treeViewService.SaveState).toHaveBeenCalledWith({
  //     Name: 'SavedStateName',
  //     SavedOption: '',
  //     SavedText: '',
  //     SelectedNode: [],
  //   });
  //   expect(component.isSaveEnabled).toBe(false); 
  // });

  it('should open the dialog and perform actions on dialog result', () => {
    spyOn(dialog, 'open').and.callThrough();

    component.openSaveDialog();

    expect(dialog.open).toHaveBeenCalledWith(SaveTreeStateDialog, {
      width: '250px',
      data: component.savedStateName,
    });

    // Simulate the dialog result
    fixture.detectChanges(); // Trigger change detection.
    fixture.whenStable().then(() => {
      expect(component.savedStateName).toBe('DialogResult');
      expect(component.isSaveEnabled).toBe(false);
    });

  });




  it('should reset component properties and emit an event', () => {
    spyOn(treeViewService, 'setSelectedSavedTreeState');
    spyOn(component.userChanged, 'emit');
  
    component.fieldCheckbox = false;
    component.batteryCheckbox = true;
    component.padCheckbox = true;
    component.wellCheckbox = true;
    component.selectedNodeTypes = [NodeType.Battery, NodeType.Wells];
  
    component.onClear();
  
    expect(component.fieldCheckbox).toBeTrue();
    expect(component.batteryCheckbox).toBeFalse();
    expect(component.padCheckbox).toBeFalse();
    expect(component.wellCheckbox).toBeFalse();
    expect(component.selectedNodeTypes).toEqual([NodeType.Field]);
  
    expect(treeViewService.setSelectedSavedTreeState).toHaveBeenCalledWith(null);
  
    expect(component.userChanged.emit).toHaveBeenCalledWith({ clear: true });
  });

  // it('should add the node type to selectedNodeTypes if event is checked', () => {
  //   const initialSelectedNodeTypes = [NodeType.Field, NodeType.Battery];
  //   component.selectedNodeTypes = [...initialSelectedNodeTypes];
  //   const nodeTypeToAdd = NodeType.Pad;
  
  //   component.onCheckBoxChange({ checked: true }, nodeTypeToAdd);
  
  //   expect(component.selectedNodeTypes).toContain(nodeTypeToAdd);
  //   expect(component.selectedNodeTypes.length).toBe(initialSelectedNodeTypes.length + 1);
  
  //   initialSelectedNodeTypes.forEach((nodeType) => {
  //     expect(component.selectedNodeTypes).toContain(nodeType);
  //   });
  // });
  
  // it('should remove the node type from selectedNodeTypes if event is unchecked', () => {
  //   const initialSelectedNodeTypes = [NodeType.Field, NodeType.Battery, NodeType.Pad];
  //   component.selectedNodeTypes = [...initialSelectedNodeTypes];
  //   const nodeTypeToRemove = NodeType.Battery;
  
  //   component.onCheckBoxChange({ checked: true }, nodeTypeToRemove);
  
  //   expect(component.selectedNodeTypes).not.toContain(nodeTypeToRemove);
  //   expect(component.selectedNodeTypes).toEqual([...initialSelectedNodeTypes.filter(x => x !== nodeTypeToRemove)]);
  // });

  it('should call setSelectedSavedTreeState with the correct arguments', () => {
    const event = mockMatSelectChange;
  
    spyOn(treeViewService, 'setSelectedSavedTreeState');
  
    component.onSelect(event);
  
    expect(treeViewService.setSelectedSavedTreeState).toHaveBeenCalledWith(null, true);
  });

  
});




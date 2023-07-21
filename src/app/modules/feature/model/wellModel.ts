export interface WellModel {
     id:number;
     wellName:string;
     status:string;
     location:string;
     avgSPM:number;
     wellState:string;
     pumpCardDiagnostics:string;
     motorCurrent:number;
     pumpDisplacement:number;
     currentCardArea:number;
     communicationStatus:string;
     controllerStatus:string;
     performanceStatus:string;
     inferredProduction:number;
     effectiveRuntime:number;
     cycleToday:number;
     structuralLoad:number;
     minMaxLoad:number;
     gearBoxLoad:number;
     rodStress:number;
     yesterdayCycle:number;
     battery:string;
     pad:string;
     field:string;
     createdBy:number;
     updatedBy:number;
     createdDateTime:any;
     updatedDateTime:any;
}
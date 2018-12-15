import { ContractCoverage } from "./contractCoverage";

 export class Suppressor {

   constructor(private contract: ContractCoverage) {
   }

   public process() {
     this.contract.source = this.contract.source.replace(/pure/g, "");
     this.contract.source = this.contract.source.replace(/view/g, "");
   }
 }
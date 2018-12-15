const CONTRACT_ID_FACTOR = 100000000;
const INJECTION_POINT_ID_FACTOR = 10000;

 export function encrypt(contractId: number, injectionPointId: number, locationIdx?: number) {
   return contractId * CONTRACT_ID_FACTOR + injectionPointId * INJECTION_POINT_ID_FACTOR + (locationIdx || 0);
 }

 export function decrypt(value: number) {
   const contractId = Math.floor(value / CONTRACT_ID_FACTOR);
   const injectionPointId = Math.floor(value / INJECTION_POINT_ID_FACTOR) - contractId * INJECTION_POINT_ID_FACTOR;
   const locationIdx = value - contractId * CONTRACT_ID_FACTOR - injectionPointId * INJECTION_POINT_ID_FACTOR;

   return {contractId, injectionPointId, locationIdx};
 }
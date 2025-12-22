import type { BusinessUnit } from "../types/business-unit.type";


export interface BusinessUnitGateway {

  retrieveAll: () => Promise<Array<BusinessUnit>>;

}

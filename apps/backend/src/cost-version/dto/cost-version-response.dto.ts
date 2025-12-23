export class CostVersionResponseDto {
  costVersionId: string;

  costVersionName: string;

  startDate: string;

  endDate: string;

  description: string;

  createdOn: string;

  modifiedBy: string;

  modifiedOn: string;

  businessunitId: string;

  hasCostRegisters?: boolean;
}
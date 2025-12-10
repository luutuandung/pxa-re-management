import { api } from './api-client';
import type {
  CostPatternCostVersion,
  CostPatternDetail,
  CostPatternBuCostItemRow,
  CostPatternCategoryOptionsResponse,
  CreateCostPatternDetailResponse,
} from '@pxa-re-management/shared';

export async function fetchCostVersions(businessunitId: string): Promise<CostPatternCostVersion[]> {
  const res = await api
    .get('cost-pattern/cost-versions', { searchParams: { businessunitId } })
    .json<CostPatternCostVersion[]>();
  return res;
}

export async function fetchPatternDetails(businessunitId: string): Promise<CostPatternDetail[]> {
  const res = await api
    .get('cost-pattern/pattern-details', { searchParams: { businessunitId } })
    .json<CostPatternDetail[]>();
  return res;
}

export async function fetchBuCostItems(
  businessunitId: string,
  costVersionId?: string,
): Promise<CostPatternBuCostItemRow[]> {
  const searchParams: Record<string, string> = { businessunitId };
  if (costVersionId) {
    searchParams.costVersionId = costVersionId;
  }
  const res = await api.
      get(
        'cost-pattern/bu-cost-items',
        {
          searchParams: {
            businessunitId,
            ...typeof costVersionId === "undefined" ? null : { costVersionId }
          }
        }
      ).
      json<CostPatternBuCostItemRow[]>();
  return res;
}

export async function bulkAssignPattern(params: {
  costRegisterIds: string[];
  costPatternDetailId: string;
}): Promise<{ updated: number }> {
  const res = await api.post('cost-pattern/bulk-assign', { json: params }).json<{ updated: number }>();
  return res;
}

export async function getCategoryOptions(): Promise<CostPatternCategoryOptionsResponse> {
  const res = await api.get('cost-pattern/category-options').json<CostPatternCategoryOptionsResponse>();
  return res;
}

export async function createPatternDetail(
  req: Omit<CostPatternDetail, 'costPatternDetailId' | 'costPatternCd' | 'costPatternModelCategories' | 'costPatternDestCategories'> & {
    costPatternModelCategories: Array<{ modelCategoryId: string; seq: number }>;
    costPatternDestCategories: Array<{ destCategoryId: string; secFlg: boolean; seq: number }>;
  },
): Promise<CreateCostPatternDetailResponse> {
  const res = await api.post('cost-pattern/pattern-details', { json: req }).json<CreateCostPatternDetailResponse>();
  return res;
}



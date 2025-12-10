import { api, createMultipartApiClient } from './api-client';
import type {
  GetCostRegisterListResponse,
  GetExcelRequest,
  GetCostRegisterListRequest,
  GetPatternDetailsResponse,
  PostExcelUploadRequest,
  PostExcelUploadResponse,
} from '@pxa-re-management/shared';

export async function fetchPatternDetails(): Promise<GetPatternDetailsResponse> {
  return api.get('cost-register/pattern-details').json<GetPatternDetailsResponse>();
}

export async function fetchCostRegisterList(req: GetCostRegisterListRequest): Promise<GetCostRegisterListResponse> {
  return api.get('cost-register/list', { searchParams: req as any }).json<GetCostRegisterListResponse>();
}

export async function downloadExcel(req: GetExcelRequest): Promise<Blob> {
  return api.get('cost-register/excel', { searchParams: req as any }).blob();
}

export async function uploadExcel(req: PostExcelUploadRequest, file: File): Promise<PostExcelUploadResponse> {
  const form = new FormData();
  form.append('costPatternDetailId', req.costPatternDetailId);
  form.append('file', file);
  const multipart = createMultipartApiClient();
  return multipart.post('cost-register/excel-upload', { body: form }).json<PostExcelUploadResponse>();
}

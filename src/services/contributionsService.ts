import { apiFetch, ApiError } from './apiClient';
import type {
  ContributionOut,
  TakeCreateOut,
  TakeOut,
  PaginatedContributionsOut,
  SyncBatchIn,
  SyncBatchOut,
} from '../types';

export interface CreateContributionPayload {
  clientId: string;
  wordId: string;
}

export interface CreateTakePayload {
  takeNumber: number;
  mimeType: string;
  sizeBytes: number;
  durationMs: number;
  recordedAt?: string;
  width?: number;
  height?: number;
}

export const contributionsService = {
  async createContribution(payload: CreateContributionPayload): Promise<ContributionOut> {
    return apiFetch<ContributionOut>('/api/v1/contributions', {
      method: 'POST',
      body: JSON.stringify({
        clientId: payload.clientId,
        wordId: payload.wordId,
      }),
    });
  },

  async requestTakeUpload(
    contributionId: string,
    payload: CreateTakePayload
  ): Promise<TakeCreateOut> {
    return apiFetch<TakeCreateOut>(`/api/v1/contributions/${contributionId}/takes`, {
      method: 'POST',
      body: JSON.stringify({
        takeNumber: payload.takeNumber,
        mimeType: payload.mimeType,
        sizeBytes: payload.sizeBytes,
        durationMs: payload.durationMs,
        recordedAt: payload.recordedAt,
        width: payload.width || 0,
        height: payload.height || 0,
      }),
    });
  },

  uploadTakeBlob(
    url: string,
    blob: Blob,
    mimeType: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', mimeType);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(event.loaded, event.total);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          let code = 'upload_error';
          let message = `Fallo en la subida del archivo (HTTP ${xhr.status})`;
          try {
            const errObj = JSON.parse(xhr.responseText);
            if (errObj?.error) {
              code = errObj.error.code || code;
              message = errObj.error.message || message;
            }
          } catch {}
          reject(new ApiError(xhr.status, code, message));
        }
      };

      xhr.onerror = () => {
        reject(new ApiError(0, 'network_error', 'Error de red durante la subida del video'));
      };

      xhr.send(blob);
    });
  },

  async completeTake(contributionId: string, takeNumber: number): Promise<{ take: TakeOut }> {
    return apiFetch<{ take: TakeOut }>(
      `/api/v1/contributions/${contributionId}/takes/${takeNumber}/complete`,
      { method: 'POST' }
    );
  },

  async submitContribution(contributionId: string): Promise<ContributionOut> {
    return apiFetch<ContributionOut>(`/api/v1/contributions/${contributionId}/submit`, {
      method: 'POST',
    });
  },

  async syncOfflineQueue(payload: SyncBatchIn): Promise<SyncBatchOut> {
    return apiFetch<SyncBatchOut>('/api/v1/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getUserContributions(params: { status?: string; limit?: number; offset?: number } = {}): Promise<PaginatedContributionsOut> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.limit !== undefined) query.set('limit', String(params.limit));
    if (params.offset !== undefined) query.set('offset', String(params.offset));

    const queryString = query.toString();
    const endpoint = `/api/v1/contributions${queryString ? `?${queryString}` : ''}`;
    return apiFetch<PaginatedContributionsOut>(endpoint, { method: 'GET' });
  },
};

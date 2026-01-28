/**
 * Common types and interfaces
 * Centralized type definitions for the application
 */

// ============= Device & Platform =============

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Platform = 'ios' | 'android' | 'desktop';

// ============= Billing =============

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

// ============= Vote Direction =============

export type VoteDirection = 'up' | 'down';

// ============= Loading States =============

export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export function createLoadingState(isLoading = false, error: string | null = null): LoadingState {
    return { isLoading, error };
}

// ============= API Response =============

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export function createApiResponse<T>(success: boolean, data?: T, error?: string): ApiResponse<T> {
    return { success, data, error };
}

// ============= Localized Content =============

export type LocalizedContent = Record<string, string>;

export interface LocalizedField<T> {
    en: T;
    zh?: T;
    'zh-Hant'?: T;
    ko?: T;
    es?: T;
    ja?: T;
}

// ============= Pagination =============

export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export function calculatePagination<T>(
    items: T[],
    total: number,
    page: number,
    pageSize: number
): PaginatedResult<T> {
    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
    };
}

export interface PaginationMetadata {
    total: number;
    currentPage: number;
    perPage: number;
    lastPage: number;
}

export interface PaginationInterface<T> {
    data: T[];
    paginationMetadata: PaginationMetadata;
}

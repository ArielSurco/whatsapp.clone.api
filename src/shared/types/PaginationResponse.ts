export interface PaginationResponse<T = unknown> {
  results: T[]
  total: number
}

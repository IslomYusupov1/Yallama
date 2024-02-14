export interface PaginationProps {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly total: number;
}
export enum RolesEnum {
  WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER",
  ACCOUNTANT = "ACCOUNTANT",
  OPERATOR = "OPERATOR",
  ADMIN = "ADMIN",
}
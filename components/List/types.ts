import {Entity, Fragment, IdentifiableEntity} from '../../api/types'
import {ReactNode} from 'react'

export enum OrderByDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type OrderByInput = {
  field: string,
  direction?: OrderByDirection,
};

export type PageInfo = {
  limit?: number,
  offset?: number,
  hasNextPage?: boolean,
};

export type PaginationInput = {
  limit?: number,
  offset?: number,
}

export interface ListProps<TFilter extends FilterType> {
  entityFragment: Fragment
  defaultPageLimit?: number
  children?: ReactNode
  getDetailUrl?: (entity?: IdentifiableEntity) => string
}

export interface FilterType {

}

export interface ListResponse<E extends Entity> {
  list: {
    totalCount: number
    pageInfo: {
      limit: number
      offset: number
      hasNextPage: boolean
    }
    edges: E[]
  }
}

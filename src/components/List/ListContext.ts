import {createContext, useContext} from 'react'
import {Fragment, IdentifiableEntity} from '../../api/types'
import {Filter, OrderByInput} from './types'

export interface ListContextValue<E extends IdentifiableEntity> {
    entityFragment: Fragment
    loading: boolean
    error: boolean
    entities: E[] | undefined
    page: number
    setPage: (page: number) => void
    pageLimit: number
    setPageLimit: (pageLimit: number) => void
    orderBy: OrderByInput[]
    setOrderBy: (orderBy: OrderByInput[]) => void
    filter: Filter
    setFilter: (filter: Filter) => void
}

const ListContext = createContext<ListContextValue<any> | null>(null)

export function useListContext<E extends IdentifiableEntity>(): ListContextValue<E> {
    const ctx = useContext(ListContext)
    if(!ctx) {
        throw new Error()
    }
    return ctx
}

export default ListContext

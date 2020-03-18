import {Fragment, IdentifiableEntity} from '../../api/types'
import {Filter, OrderByInput} from './types'
import prepareContext from '@bast1oncz/components/dist/logic/prepareContext'

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
    getDetailUrl?: (entity: IdentifiableEntity) => string
}

const {context: ListContext, useContext} = prepareContext<ListContextValue<any>>('List')

export const useListContext = useContext
export default ListContext

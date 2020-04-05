import {Fragment, IdentifiableEntity} from '../../api/types'
import {FilterType, OrderByInput} from './types'
import prepareContext from '@bast1oncz/components/dist/logic/prepareContext'

export interface ListContextValue<E extends IdentifiableEntity> {
    entityFragment: Fragment
    loading: boolean
    error: boolean
    entities: E[] | undefined
    page: number
    setPage: (page: number) => void
    pageLimit: number
    lastPage: number
    setPageLimit: (pageLimit: number) => void
    orderBy: OrderByInput[]
    setOrderBy: (orderBy: OrderByInput[]) => void
    filterName: string|null
    filter: FilterType
    setFilter: (filter: FilterType) => void
    selection: IdentifiableEntity['id'][]
    setSelection: (selection: IdentifiableEntity['id'][]) => void
    getDetailUrl?: (entity?: IdentifiableEntity) => string
}

const {context: ListContext, useContext} = prepareContext<ListContextValue<any>>('List')

export const useListContext = useContext
export default ListContext

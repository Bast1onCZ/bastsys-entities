import React, {
    memo,
    useCallback, useEffect,
    useMemo,
    useState
} from 'react'
import {FilterType, ListProps, ListResponse, OrderByInput, PaginationInput} from './types'
import {useQuery} from '@apollo/client'
import generateEntityListQuery from '../../api/generate/generateEntityListQuery'
import {IdentifiableEntity} from '../../api/types'
import ListContext, {ListContextValue} from './ListContext'
import filterChildren from '@bast1oncz/objects/react/filterChildren'
import Filter from '../Filter'
import {FilterProps} from '../Filter/Filter'
import useResettableState from '@bast1oncz/state/useResettableState'
import hash from 'object-hash'
import useCookie from '@bast1oncz/cookies/useCookie'
import moment from 'moment'

const DEFAULT_DEFAULT_FILTER = {}
const settingsExpiration = moment().add(1, 'year').valueOf()

function List<E extends IdentifiableEntity, F extends FilterType = {}>(props: ListProps<F>) {
    const {
        entityFragment,
        defaultPageLimit = 10,
        getDetailUrl,
        children
    } = props

    // cookie stored page limit
    const cookieId = useMemo(() => {
        return hash({
            entityFragment: JSON.stringify(entityFragment), // stringify because of an error of js class instance
            list: true
        })
    }, [entityFragment])
    const [settingsString, setSettingsString] = useCookie(cookieId, {expires: settingsExpiration})
    const {pageLimit} = useMemo(() => {
        const parsedObject = settingsString ? JSON.parse(settingsString) : {}

        return {
            pageLimit: parsedObject.pageLimit || defaultPageLimit
        }
    }, [settingsString, defaultPageLimit])
    const setPageLimit = useCallback((pageLimit: number) => {
        const settings = settingsString ? JSON.parse(settingsString) : {}
        const newSettings = {
            ...settings,
            pageLimit
        }

        setSettingsString(JSON.stringify(newSettings))
    }, [settingsString, setSettingsString])

    // -- Order by --
    const [orderBy, setOrderBy] = useState<OrderByInput[]>([])

    // -- Pagination --
    const [page, setPage] = useState<number>(1)
    const changePageLimit = useCallback((newPageLimit: number) => {
        // changes page limit so that new page is adjusted
        const currentOffset = (page - 1) * pageLimit
        const newCurrentOffset = Math.floor(currentOffset / newPageLimit)
        const newPage = (newCurrentOffset / newPageLimit) + 1
        setPage(newPage)
        setPageLimit(newPageLimit)
    }, [page, pageLimit])

    // -- Filter --
    const filterElements = filterChildren<FilterProps<any>, typeof Filter>(children, Filter)
    if(filterElements.length > 1) {
        throw new Error('List cannot contain more <Filter /> elements at once')
    }

    const filterProps = filterElements[0]?.props || {}
    const {name: filterName, defaultFilter = DEFAULT_DEFAULT_FILTER, filter: controlledFilter} = filterProps

    const [filter, setFilter] = useState<FilterType>(defaultFilter)
    useEffect(() => {
        if(controlledFilter) {
            setFilter(controlledFilter)

            return () => setFilter(defaultFilter)
        }
    }, [controlledFilter, defaultFilter])

    //  -- Pagination --
    const pagination = useMemo<PaginationInput>(() => ({
        offset: (page - 1) * pageLimit,
        limit: pageLimit
    }), [page, pageLimit])

    // -- Selection --
    const [selection, setSelection, resetSelection] = useResettableState<IdentifiableEntity['id'][]>([])

    // -- Communication --
    const listQuery = useMemo(() => generateEntityListQuery(entityFragment, {
        filterName: filterName || undefined,
        withoutFilter: !filterName
    }), [entityFragment, filterName])
    const queryResponse = useQuery<ListResponse<E>>(listQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            orderBy,
            pagination,
            filter
        },
        onCompleted: resetSelection
    })

    const contextValue = useMemo<ListContextValue<E>>(() => ({
        entityFragment,
        loading: queryResponse.loading,
        error: !!queryResponse.error,
        entities: queryResponse.data?.list?.edges,
        lastPage: Math.ceil((queryResponse.data?.list?.totalCount || 0) / pageLimit),
        selection,
        setSelection,
        filterName,
        filter,
        setFilter, // const
        orderBy,
        page,
        setPage,
        pageLimit,
        offset: (page - 1) * pageLimit,
        setPageLimit: changePageLimit,
        setOrderBy, // const
        getDetailUrl
    }), [entityFragment, queryResponse, selection, filterName, filter, orderBy, page, pageLimit, changePageLimit, getDetailUrl])

    return (
        <ListContext.Provider value={contextValue}>
            {children}
        </ListContext.Provider>
    )
}

export default memo(List)

import React, {memo, useCallback, useMemo, useState} from 'react'
import {Filter, ListProps, ListResponse, OrderByInput, PaginationInput} from './types'
import {useQuery} from '@apollo/react-hooks'
import generateEntityListQuery from '../../api/generate/generateEntityListQuery'
import {IdentifiableEntity} from '../../api/types'
import ListContext, {ListContextValue} from './ListContext'

function List<E extends IdentifiableEntity, F extends Filter = {}>(props: ListProps<F>) {
    const {
        entityFragment,
        withoutFilter,
        defaultPageLimit = 10,
        defaultFilter = {},
        getDetailUrl,
        children
    } = props

    const [orderBy, setOrderBy] = useState<OrderByInput[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageLimit, setPageLimit] = useState<number>(defaultPageLimit)
    const changePageLimit = useCallback((newPageLimit: number) => {
        // changes page limit so that new page is adjusted
        const currentOffset = (page - 1) * pageLimit
        const newCurrentOffset = Math.floor(currentOffset / newPageLimit)
        const newPage = (newCurrentOffset / newPageLimit) + 1
        setPage(newPage)
        setPageLimit(newPageLimit)
    }, [page, pageLimit])

    const [filter, setFilter] = useState<Filter>(defaultFilter)

    const pagination = useMemo<PaginationInput>(() => ({
        offset: (page - 1) * pageLimit,
        limit: pageLimit
    }), [page, pageLimit])

    const listQuery = useMemo(() => generateEntityListQuery(entityFragment, {withoutFilter}), [entityFragment, withoutFilter])
    const queryResponse = useQuery<ListResponse<E>>(listQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            orderBy,
            pagination,
            filter
        }
    })

    const contextValue = useMemo<ListContextValue<E>>(() => ({
        entityFragment,
        loading: queryResponse.loading,
        error: !!queryResponse.error,
        entities: queryResponse.data?.list?.edges,
        lastPage: Math.ceil((queryResponse.data?.list?.totalCount || 0) / pageLimit),
        filter,
        setFilter, // const
        orderBy,
        page,
        setPage,
        pageLimit,
        setPageLimit: changePageLimit,
        setOrderBy, // const
        getDetailUrl
    }), [entityFragment, queryResponse, filter, orderBy, page, pageLimit, changePageLimit, getDetailUrl])

    return (
        <ListContext.Provider value={contextValue}>
            {children}
        </ListContext.Provider>
    )
}

export default memo(List)

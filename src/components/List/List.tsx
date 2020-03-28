import React, {Children, memo, ReactElement, useCallback, useMemo, useState} from 'react'
import {FilterType, ListProps, ListResponse, OrderByInput, PaginationInput} from './types'
import {useQuery} from '@apollo/react-hooks'
import generateEntityListQuery from '../../api/generate/generateEntityListQuery'
import {IdentifiableEntity} from '../../api/types'
import ListContext, {ListContextValue} from './ListContext'
import Filter from '../Filter'
import {FilterProps} from '../Filter/Filter'

function List<E extends IdentifiableEntity, F extends FilterType = {}>(props: ListProps<F>) {
    const {
        entityFragment,
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

    let filterName: string|null = null
    Children.forEach(children, (child) => {
        if((child as ReactElement)?.type === Filter) {
            filterName = (child as ReactElement<FilterProps>).props.name
        }
    })

    const [filter, setFilter] = useState<FilterType>(defaultFilter)

    const pagination = useMemo<PaginationInput>(() => ({
        offset: (page - 1) * pageLimit,
        limit: pageLimit
    }), [page, pageLimit])

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
        }
    })

    const contextValue = useMemo<ListContextValue<E>>(() => ({
        entityFragment,
        loading: queryResponse.loading,
        error: !!queryResponse.error,
        entities: queryResponse.data?.list?.edges,
        lastPage: Math.ceil((queryResponse.data?.list?.totalCount || 0) / pageLimit),
        filterName,
        filter,
        setFilter, // const
        orderBy,
        page,
        setPage,
        pageLimit,
        setPageLimit: changePageLimit,
        setOrderBy, // const
        getDetailUrl
    }), [entityFragment, queryResponse, filterName, filter, orderBy, page, pageLimit, changePageLimit, getDetailUrl])

    return (
        <ListContext.Provider value={contextValue}>
            {children}
        </ListContext.Provider>
    )
}

export default memo(List)

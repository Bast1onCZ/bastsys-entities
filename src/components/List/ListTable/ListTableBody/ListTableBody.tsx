import React, {memo, useContext} from 'react'
import ListTableContentTypeContext from '../ListTableContentTypeContext'
import mapLength from '@bast1oncz/objects/dist/array/mapLength'
import LoadingTableRow from '../LoadingTableRow/LoadingTableRow'
import TableBody from '@material-ui/core/TableBody'
import {ListTableBodyProps} from './types'
import {IdentifiableEntity} from '../../../../api/types'
import ListTableBodyEntityRow from './ListTableBodyEntityRow/ListTableBodyEntityRow'
import ListContext, {ListContextValue} from '../../../List/ListContext'

function ListTableBody<E extends IdentifiableEntity>(props: ListTableBodyProps<E>) {
  const {children} = props
  const columnCount = React.Children.count(children)
  
  const {loading, error, pageLimit, entities} = useContext(ListContext) as ListContextValue<E>
  
  return (
    <TableBody>
      <ListTableContentTypeContext.Provider value="body">
        {loading || error
          ? mapLength(pageLimit, i => (
            <LoadingTableRow key={i} columnCount={columnCount} />
          ))
          : entities?.map(entity => (
            <ListTableBodyEntityRow key={entity.id} entity={entity}>
              {children}
            </ListTableBodyEntityRow>
          ))}
      </ListTableContentTypeContext.Provider>
    </TableBody>
  )
}

export default memo(ListTableBody)

import React, {memo, useContext} from 'react'
import {ListCellElement, ListCellProps} from './types'
import ListHeaderCell from './ListHeadCell/ListHeadCell'
import ListBodyCell from './ListBodyCell/ListBodyCell'
import {IdentifiableEntity} from '../../../../api/types'
import ListTableContentTypeContext, {ListTableContentTypeContextValue} from '../ListTableContentTypeContext'

/**
 * Renders a list cell to either the list head or list body (label or content)
 *
 * @param props
 * @constructor
 */
function ListCell<E extends IdentifiableEntity>(props: ListCellProps<any>): ListCellElement<any> {
  const {hidden} = props
  
  const variant = useContext(ListTableContentTypeContext) as ListTableContentTypeContextValue

  return (
    <>
      {hidden &&
        <>
          {variant === 'head' && <ListHeaderCell {...props} />}
          {variant === 'body' && <ListBodyCell {...props} />}
        </>
      }
    </>
  )
}

export default memo(ListCell)

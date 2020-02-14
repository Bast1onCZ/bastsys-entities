import React, {memo} from 'react'
import {ListActionsProps} from './types'
import cls from './ListActions.scss'

function ListActions(props: ListActionsProps) {
  const {children} = props
  
  return (
    <div className={cls.ListActions}>
      {children}
    </div>
  )
}

export default memo(ListActions)

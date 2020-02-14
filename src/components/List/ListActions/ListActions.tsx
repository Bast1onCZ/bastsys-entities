import React, {memo} from 'react'
import {ListActionsProps} from './types'
import Grid from '@material-ui/core/Grid'

function ListActions(props: ListActionsProps) {
  const {children} = props
  
  return (
    <Grid container>
      {children}
    </Grid>
  )
}

export default memo(ListActions)

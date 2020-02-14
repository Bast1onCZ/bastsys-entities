import {ReactElement} from 'react'
import {ButtonProps} from '@material-ui/core/Button'

export interface ListActionsProps {
  children: ReactElement<ButtonProps> | ReactElement<ButtonProps>[]
}

import React, {memo, useCallback} from 'react'
import { SyncFieldDefinition} from '../../../hooks/entityField/types'
import { useBooleanField} from '../../../index'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

export interface BooleanFieldProps extends SyncFieldDefinition {

}

function BooleanField(props: BooleanFieldProps) {
    const {value, isSyncing, confirmChange} = useBooleanField(props)

    const handleChange = useCallback((e, checked: boolean) => {
        console.log('wanna change ', checked)
        confirmChange(checked)
    }, [confirmChange])

    return (
        <FormControlLabel
            disabled={isSyncing}
            control={
                <Checkbox checked={value} onChange={handleChange} />
            }
            label={props.label}
        />
    )
}

export default memo(BooleanField)

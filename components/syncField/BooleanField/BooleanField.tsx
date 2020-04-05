import React, {forwardRef, memo, useCallback} from 'react'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import useBooleanField from '../../../hooks/entityField/useBooleanField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'

export interface BooleanFieldProps extends SyncFieldDefinition {
    hidden?: boolean
    disabled?: boolean
}

const BooleanField = forwardRef<SyncFieldReference, BooleanFieldProps>((props, ref) => {
    const {value, isSyncing, confirmChange, disabled: entityDisabled} = useBooleanField(props, ref)

    const handleChange = useCallback((e, checked: boolean) => {
        confirmChange(checked)
    }, [confirmChange])

    return props.hidden
        ? null
        : (
            <FormControlLabel
                disabled={isSyncing || props.disabled || entityDisabled}
                control={
                    <Checkbox checked={value} onChange={handleChange}/>
                }
                label={props.label}
            />
        )
})

export default memo(BooleanField)

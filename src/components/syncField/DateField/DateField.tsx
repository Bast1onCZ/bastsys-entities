import React, {forwardRef, KeyboardEvent, memo, useCallback, useRef} from 'react'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import {useStringField} from '../../../index'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'
import {KeyboardDatePicker} from '@material-ui/pickers'
import CircularProgress from '@material-ui/core/CircularProgress'

export interface DateFieldProps extends SyncFieldDefinition {
    hidden?: boolean
    disabled?: boolean
}

const DateField = forwardRef<SyncFieldReference, DateFieldProps>((props, ref) => {
    const {value, changeTempValue, validation, isDirty, isSyncing, confirmChange} = useStringField(props, ref)

    const inputRef = useRef<HTMLDivElement>(null)
    const handleTempChange = useCallback((date) => {
        changeTempValue(date.toString())
    }, [changeTempValue])
    const handleKeyPress = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            inputRef.current?.blur()
        }
    }, [])
    const handleBlur = useCallback(() => {
        if (!validation.hasError) {
            confirmChange()
        }
    }, [validation.hasError, confirmChange])

    return props.hidden
        ? null
        : (
            <KeyboardDatePicker
                ref={inputRef}
                value={value}
                onChange={handleTempChange}
                label={props.label}
                onKeyPress={handleKeyPress}
                onBlur={handleBlur}
                format="MM/dd/yyyy"
                error={validation.hasError}
                helperText={validation.error}
                disabled={isSyncing || props.disabled}
                keyboardIcon={isSyncing ? <CircularProgress size={20} color="secondary"/> : undefined}
            />
        )
})

export default memo(DateField)

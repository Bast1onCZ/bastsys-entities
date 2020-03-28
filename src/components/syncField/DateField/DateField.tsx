import React, {forwardRef, KeyboardEvent, memo, useCallback, useRef} from 'react'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'
import {KeyboardDatePicker} from '@material-ui/pickers'
import CircularProgress from '@material-ui/core/CircularProgress'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import useDateTimeField from '../../../hooks/entityField/useDateTimeField'
import {Moment} from 'moment'
import DirtyIcon from '@material-ui/icons/CreateOutlined'

export interface DateFieldProps extends SyncFieldDefinition {
    hidden?: boolean
    disabled?: boolean
    deletable?: boolean
}

const DateField = forwardRef<SyncFieldReference, DateFieldProps>((props, ref) => {
    const {tempValue, shownValue, validation, changeTempValue, isDirty, isSyncing, confirmChange} = useDateTimeField(props, ref)

    const inputRef = useRef<HTMLInputElement>(null)
    const handleTempChange = useCallback((date: MaterialUiPickersDate) => {
        const mmt = date as Moment | null

        if (mmt?.isValid() && document.activeElement !== inputRef.current) {
            confirmChange(mmt)
        } else {
            changeTempValue(mmt)
        }
    }, [changeTempValue, confirmChange])
    const handleKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            inputRef.current?.blur()
        }
    }, [])
    const handleBlur = useCallback(() => {
        if (tempValue && tempValue.isValid() &&  !validation.hasError) {
            confirmChange()
        }
    }, [tempValue, validation.hasError, confirmChange])

    return props.hidden
        ? null
        : (
            <KeyboardDatePicker
                inputRef={inputRef}
                value={shownValue}
                onChange={handleTempChange}
                label={props.label}
                onKeyPress={handleKeyPress}
                onBlur={handleBlur}
                format="DD/MM/YYYY"
                error={validation.hasError}
                helperText={validation.error}
                disabled={isSyncing || props.disabled}
                keyboardIcon={
                    isSyncing ? <CircularProgress size={20} color="secondary"/>
                        : isDirty ? <DirtyIcon color="secondary"/>
                        : undefined
                }
                clearable={props.deletable}
                fullWidth
            />
        )
})

export default memo(DateField)

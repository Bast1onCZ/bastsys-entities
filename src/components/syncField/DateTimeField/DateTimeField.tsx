import React, {forwardRef, KeyboardEvent, memo, useCallback, useRef} from 'react'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import useDateTimeField from '../../../hooks/entityField/useDateTimeField'
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date'
import {Moment} from 'moment'
import {KeyboardDateTimePicker} from '@material-ui/pickers'
import CircularProgress from '@material-ui/core/CircularProgress'
import DirtyIcon from '@material-ui/core/SvgIcon/SvgIcon'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'

export interface DateTimeFieldProps extends SyncFieldDefinition {
    hidden?: boolean
    disabled?: boolean
    deletable?: boolean
}

const DateTimeField = forwardRef<SyncFieldReference, DateTimeFieldProps>((props, ref) => {
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
        if (tempValue && tempValue.isValid() && !validation.hasError) {
            confirmChange()
        }
    }, [tempValue, validation.hasError, confirmChange])

    return props.hidden
        ? null
        : (
            <KeyboardDateTimePicker
                inputRef={inputRef}
                value={shownValue}
                onChange={handleTempChange}
                label={props.label}
                onKeyPress={handleKeyPress}
                onBlur={handleBlur}
                format="DD/MM/YYYY HH:mm"
                error={validation.hasError}
                helperText={validation.error}
                disabled={isSyncing || props.disabled}
                keyboardIcon={
                    isSyncing ? <CircularProgress size={20} color="secondary"/>
                        : isDirty ? <DirtyIcon color="secondary"/>
                        : undefined
                }
                fullWidth
            />
        )
})

export default memo(DateTimeField)

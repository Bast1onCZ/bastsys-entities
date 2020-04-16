import React, {forwardRef, KeyboardEvent, memo, useCallback, useMemo, useRef} from 'react'
import useStringField from '../../../hooks/entityField/useStringField'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import TextField from '@material-ui/core/TextField'
import useValueChangeHandler from '@bast1oncz/components/hooks/input/useValueChangeHandler'
import {InputProps} from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress'
import DirtyIcon from '@material-ui/icons/CreateOutlined'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'

export interface StringFieldProps extends SyncFieldDefinition {
    hidden?: boolean
    multiline?: boolean
    disabled?: boolean
}

const StringField = forwardRef<SyncFieldReference, StringFieldProps>((props, ref) => {
    const {label, multiline, disabled, hidden} = props
    const {changeTempValue, confirmChange, isDirty, isSyncing, tempValue, validation, value, disabled: entityDisabled} = useStringField(props, ref)

    const shownValue = isDirty ? tempValue : value

    const handleTempValueChange = useValueChangeHandler(changeTempValue)

    const inputRef = useRef<HTMLInputElement>()
    const InputProps = useMemo<InputProps>(() => {
        const inputProps: InputProps = {}
        if (isSyncing) {
            inputProps.endAdornment = (
                <InputAdornment position="end">
                    <CircularProgress size={20}/>
                </InputAdornment>
            )
        } else if (isDirty) {
            inputProps.endAdornment = (
                <InputAdornment position="end">
                    <DirtyIcon/>
                </InputAdornment>
            )
        }
        return inputProps
    }, [isDirty, isSyncing])

    const handleBlur = useCallback(() => {
        if (!validation.hasError) {
            // confirm change only if temp value is valid
            confirmChange()
        }
    }, [confirmChange, validation.hasError])
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (!multiline && e.key === 'Enter') {
            inputRef.current?.blur()
        }
    }, [multiline])

    return hidden
        ? null
        : (
            <TextField
                label={label}
                inputRef={inputRef}
                value={shownValue}
                InputProps={InputProps}
                onChange={handleTempValueChange}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                error={validation.hasError}
                helperText={validation.error}
                multiline={multiline}
                disabled={disabled || entityDisabled}
                fullWidth
            />
        )
})

export default memo(StringField)

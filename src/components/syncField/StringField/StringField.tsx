import React, {forwardRef, KeyboardEvent, memo, useCallback, useMemo, useRef} from 'react'
import useStringField from '../../../hooks/entityField/useStringField'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import TextField from '@material-ui/core/TextField'
import useValueChangeHandler from '@bast1oncz/components/dist/hooks/input/useValueChangeHandler'
import {InputProps} from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress'
import DirtyIcon from '@material-ui/icons/CreateOutlined'

export interface StringFieldProps extends SyncFieldDefinition {
    multiline?: boolean
}

const StringField = forwardRef<any, StringFieldProps>((props, ref) => {
    const {multiline} = props
    const {changeTempValue, confirmChange, isDirty, isSyncing, tempValue, validation, value} = useStringField(props, ref)

    const shownValue = isDirty ? tempValue : value

    const handleTempValueChange = useValueChangeHandler(changeTempValue)

    const inputRef = useRef<HTMLInputElement>()
    const InputProps = useMemo<InputProps>(() => {
        const inputProps: InputProps = {}
        if(isSyncing) {
            inputProps.endAdornment = (
                <InputAdornment position="end">
                    <CircularProgress />
                </InputAdornment>
            )
        } else if(isDirty) {
            inputProps.endAdornment = (
                <InputAdornment position="end">
                    <DirtyIcon />
                </InputAdornment>
            )
        }
        return inputProps
    }, [isDirty, isSyncing])

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if(!multiline && e.key === 'Enter') {
            inputRef.current?.blur()
        }
    }, [multiline])

    return (
        <TextField
            inputRef={inputRef}
            value={shownValue}
            InputProps={InputProps}
            onChange={handleTempValueChange}
            onBlur={confirmChange}
            onKeyPress={handleKeyPress}
            error={validation.hasError}
            helperText={validation.error}
            multiline={multiline}
        />
    )
})

export default memo(StringField)

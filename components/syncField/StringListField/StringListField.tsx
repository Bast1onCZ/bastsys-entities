import React, {Fragment, forwardRef, memo, useCallback} from 'react'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import useArrayField from '../../../hooks/entityField/useArrayField'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'
import Chip from '@material-ui/core/Chip'
import ClearIcon from '@material-ui/icons/Clear'
import FormHelperText from '@material-ui/core/FormHelperText'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import InputAdornment from '@material-ui/core/InputAdornment'
import DirtyIcon from '@material-ui/core/SvgIcon/SvgIcon'
import removeIndex from '@bast1oncz/objects/array/removeIndex'

export interface StringListFieldProps extends SyncFieldDefinition {
    hidden?: boolean
}

const StringListField = forwardRef<SyncFieldReference, StringListFieldProps>((props, ref) => {
    const {label, hidden} = props
    const {value: values, isSyncing, isDirty, disabled, tempValue, setTempValue, confirmChange, validation} = useArrayField<string>(props, ref)

    const handleTempValueChange = useCallback(e => setTempValue(e.target.value || undefined), [setTempValue])
    const handleKeyPress = useCallback(e => e.key === 'Enter' && confirmChange(), [confirmChange])
    const handleBlur = useCallback(() => confirmChange(), [confirmChange])

    return hidden
        ? null
        : (
            <FormControl error={validation.hasError} disabled={disabled || isSyncing} fullWidth>
                <InputLabel shrink={values.length > 0 || isDirty}>{label}</InputLabel>
                <Input
                    value={tempValue || ''}
                    onChange={handleTempValueChange}
                    onKeyPress={isDirty ? handleKeyPress : undefined}
                    onBlur={isDirty ? handleBlur : undefined}
                    startAdornment={
                        <>
                            {values.map((value, i) => {
                                return (
                                    <Fragment key={i}>
                                        <Chip
                                            label={value}
                                            disabled={isSyncing || disabled}
                                            onDelete={() => confirmChange(removeIndex(values, i))}
                                            deleteIcon={<ClearIcon/>}
                                        />
                                        &nbsp;
                                    </Fragment>
                                )
                            })}
                        </>
                    }
                    endAdornment={isSyncing ? (
                        <InputAdornment position="end">
                            <CircularProgress size={20}/>
                        </InputAdornment>
                    ) : isDirty ? (
                        <InputAdornment position="end">
                            <DirtyIcon/>
                        </InputAdornment>
                    ) : null
                    }
                />
                {validation.hasError &&
                <FormHelperText>
                    {validation.error}
                </FormHelperText>
                }
            </FormControl>
        )
})

export default memo(StringListField)

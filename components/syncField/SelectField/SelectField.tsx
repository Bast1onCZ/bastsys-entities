import React, {ChangeEvent, forwardRef, memo, ReactChild, useCallback} from 'react'
import useSelectField, {SelectOption} from '../../../hooks/entityField/useSelectField'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import LinearProgress from '@material-ui/core/LinearProgress'
import FormHelperText from '@material-ui/core/FormHelperText'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'

export interface SelectFieldProps extends SyncFieldDefinition {
    label?: ReactChild
    options?: SelectOption[]
    /**
     *
     */
    deletable?: boolean
    disabled?: boolean
    hidden?: boolean
}

const loaderStyle = {margin: '7.5px 0'}

const SelectField = forwardRef<SyncFieldReference, SelectFieldProps>((props, ref) => {
    const {label, options, deletable, disabled, hidden} = props
    const {value, isSyncing, confirmChange, validation, disabled: entityDisabled} = useSelectField(props, ref)

    const handleSelectChange = useCallback((e: ChangeEvent<{ value: any }>) => {
        const value = e.target.value
        confirmChange(value === '' ? null : value)
    }, [confirmChange])

    const showLoader = !options || isSyncing
    const renderValue = useCallback((value) => {
        if (!options || showLoader) {
            return (
                <LinearProgress style={loaderStyle}/>
            )
        }
        return options.find(option => option.id === value)?.label || null
    }, [options, showLoader])

    return hidden
        ? null
        : (
            <FormControl
                error={validation.hasError}
                disabled={showLoader || disabled || entityDisabled}
                fullWidth
            >
                {label && <InputLabel shrink={showLoader || !!value}>{label}</InputLabel>}
                <Select
                    value={value || ''}
                    onChange={handleSelectChange}
                    renderValue={renderValue}
                    displayEmpty={showLoader}
                >
                    {deletable &&
                    <MenuItem value="">
                        <em>{label}</em>
                    </MenuItem>
                    }
                    {options?.map(option => {
                        const {id, label} = option

                        return (
                            <MenuItem key={id} value={id}>
                                {label}
                            </MenuItem>
                        )
                    })}
                </Select>
                {validation.hasError && <FormHelperText>{validation.error}</FormHelperText>}
            </FormControl>
        )
})

export default memo(SelectField)

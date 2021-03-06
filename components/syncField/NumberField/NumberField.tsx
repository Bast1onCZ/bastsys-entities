import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import SmartButton from '@bast1oncz/components/components/SmartButton'
import {isEntityReference, ReferableValue} from '../EntityReference'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'
import React, {forwardRef, InputHTMLAttributes, memo, useMemo, useRef} from 'react'
import EditIcon from '@material-ui/icons/EditOutlined'
import NumberFormat from 'react-number-format'
import useValueChangeHandler from '@bast1oncz/components/hooks/input/useValueChangeHandler'
import {makeStyles} from '@material-ui/core/styles'
import {useEntityContext} from '../../EntityProvider/EntityContext'
import useNumberField from '../../../hooks/entityField/useNumberField'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'
import {FormatSettings} from './FormatSettings'

const useCls = makeStyles({
    numberField: {
        '::-webkit-inner-spin-button, ::--webkit-outer-spin-button': {
            margin: 0,
            appearence: 'none'
        }
    }
})

export interface NumberFieldProps extends SyncFieldDefinition {
    label?: string
    disabled?: boolean
    hidden?: boolean
    format?: ReferableValue<FormatSettings | undefined>
    autoComplete: InputHTMLAttributes<any>['autoComplete']
}

const NumberField = forwardRef<SyncFieldReference, NumberFieldProps>((props, ref) => {
    const {entity} = useEntityContext()
    const cls = useCls()

    const format = (
        isEntityReference(props.format)
            ? props.format.getValue(entity)
            : props.format
    ) || {}

    const inputRef = useRef({blur: () => undefined})

    const {value, tempValue, changeTempValue, confirmChange, isSyncing, isDirty, validation, disabled} = useNumberField(props, ref)
    const shownValue = isDirty ? tempValue : value

    const changeValueHandler = useValueChangeHandler(changeTempValue)

    const handleKeyPress = useMemo(() => (
        validation.hasError
            ? undefined // multiline input or invalid tempValue
            : e => e.key === 'Enter' && inputRef.current.blur()
    ), [validation.hasError])
    const handleBlur = useMemo(() => (
        validation.hasError
            ? undefined
            : confirmChange
    ), [validation.hasError, confirmChange])

    // Creating CustomNumberFormat component according to NumberSyncField settings
    const CustomNumberFormat = useMemo(() =>
            (props) => {
                const {inputRef, onChange, ...restProps} = props

                return (
                    <NumberFormat
                        {...restProps}
                        getInputRef={inputRef}
                        onValueChange={values => onChange({
                            target: {
                                value: values.floatValue
                            }
                        })}
                        prefix={format.prefix}
                        suffix={format.suffix}
                        thousandSeparator={format.thousandSeparator}
                        decimalSeparator={format.decimalSeparator}
                        decimalScale={format.decimalScale}
                        fixedDecimalScale={format.fixedDecimalScale}
                        allowNegative={format.allowNegative}
                    />
                )
            }
        , [format.prefix, format.suffix, format.thousandSeparator, format.decimalSeparator, format.decimalScale, format.fixedDecimalScale, format.allowNegative])

    return props.hidden
        ? null
        : (
            <TextField
                inputRef={inputRef}
                className={cls.numberField}
                label={props.label}
                autoComplete={props.autoComplete}
                value={shownValue}
                error={validation.hasError}
                helperText={validation.error}
                disabled={props.disabled || isSyncing || disabled}
                fullWidth
                InputProps={{
                    inputComponent: CustomNumberFormat,
                    endAdornment: isDirty || isSyncing
                        ? (
                            <InputAdornment position="end">
                                <SmartButton
                                    type="icon"
                                    color="secondary"
                                    loading={isSyncing}
                                    disabled={validation.hasError}
                                    onClick={confirmChange}
                                >
                                    <EditIcon/>
                                </SmartButton>
                            </InputAdornment>
                        )
                        : undefined
                }}
                onChange={changeValueHandler}
                onKeyPress={handleKeyPress}
                onBlur={handleBlur}
            />
        )
})

export default memo(NumberField)

import Typography from '@material-ui/core/Typography'
import SmartButton from '@bast1oncz/components/dist/components/SmartButton'
import {HtmlFieldProps} from './types'
import {SyncFieldReference} from '../../EntityProvider/useSyncFieldImperativeHandle'
import ChipVariables from '@bast1oncz/components/dist/components/ChipVariables'
import EditIcon from '@material-ui/icons/Edit'
import HtmlEditor from '@bast1oncz/components/dist/components/HtmlEditor'
import React, {forwardRef, memo} from 'react'
import Grid from '@material-ui/core/Grid'
import useStringField from '../../../hooks/entityField/useStringField'

const HtmlField = forwardRef<SyncFieldReference, HtmlFieldProps>((props, ref) => {
    const {label, disabled, variables, hidden} = props
    const {value, tempValue, validation, isDirty, isSyncing, changeTempValue, confirmChange} = useStringField(props, ref)

    return hidden
        ? null
        : (
            <div>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <Typography variant="subtitle1">
                            {label}
                        </Typography>
                    </Grid>
                    {(isDirty || isSyncing) &&
                    <Grid item>
                        <SmartButton type="icon" color="secondary" loading={isSyncing} disabled={validation.hasError}
                                     onClick={confirmChange}>
                            <EditIcon/>
                        </SmartButton>
                    </Grid>
                    }
                </Grid>
                {variables && variables.length > 0 &&
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography variant="body2">Variables:</Typography>
                    </Grid>
                    <Grid item>
                        <ChipVariables
                            size="small"
                            variableDefinitions={variables.map(variable => ({
                                key: `{{ ${variable} }}`,
                                label: variable
                            }))}
                        />
                    </Grid>
                </Grid>
                }
                {validation.hasError &&
                <Typography variant="body1">
                    {validation.error}
                </Typography>
                }
                <HtmlEditor
                    value={isDirty ? tempValue : value}
                    disabled={disabled || isSyncing}
                    onChange={changeTempValue}
                    onBlur={confirmChange}
                />
            </div>
        )
})

export default memo(HtmlField)

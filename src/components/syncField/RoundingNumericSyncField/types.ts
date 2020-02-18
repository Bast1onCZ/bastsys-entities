import {RoundingNumericFieldProps} from '@bast1oncz/components/dist/form/RoundingNumericField/types'
import {SyncFieldDefinition} from '../../../hooks/entityField/types'

export interface RoundingNumericSyncFieldProps extends Omit<RoundingNumericFieldProps, 'value' | 'onChange'> {
    sync: SyncFieldDefinition
}


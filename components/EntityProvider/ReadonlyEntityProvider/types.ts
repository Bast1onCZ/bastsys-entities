import UpdateMethodType from '../UpdateMethodType'
import {BaseEntityProviderProps} from '../types'

export interface ReadonlyEntityProviderProps extends BaseEntityProviderProps {
    type: UpdateMethodType.READ_ONLY
}

export function isReadonlyEntityProviderProps(value: any): value is ReadonlyEntityProviderProps {
    return value?.type === UpdateMethodType.READ_ONLY
}


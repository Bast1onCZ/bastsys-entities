import EditableEntityContext, {EntityContextValue} from './EntityContext'
import {useContext} from 'react'
import {Entity} from '../../api/types'

export default function useEntityContext<E extends Entity>(): EntityContextValue<E> {
    const ctx = useContext<any>(EditableEntityContext)
    if(!ctx) {
        throw new Error('Entity context does not wrap this component')
    }

    return ctx
}

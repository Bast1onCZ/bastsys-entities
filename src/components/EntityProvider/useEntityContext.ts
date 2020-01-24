import EditableEntityContext, {EditableEntityContextValue} from 'components/EntityProvider/EditableEntityContext'
import {useContext} from 'react'

export default function useEntityContext(): EditableEntityContextValue<any> {
    const ctx = useContext(EditableEntityContext)
    if(!ctx) {
        throw new Error('Entity context does not wrap this component')
    }

    return ctx
}

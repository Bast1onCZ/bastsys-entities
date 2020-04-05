import {useListContext} from './ListContext'
import {useMemo} from 'react'
import {IdentifiableEntity} from '../../api/types'

export interface UseSelection<T extends IdentifiableEntity> {
    /**
     * Selected ids
     */
    ids: IdentifiableEntity['id'][],
    /**
     * Selected entities
     */
    entities: T[]
}

export default function useSelection<T extends IdentifiableEntity>(): UseSelection<T> {
    const {selection, entities} = useListContext()

    const selectedEntities = useMemo<T[]>(() => {
        return (entities || []).filter(entity => selection.indexOf(entity.id) !== -1)
    }, [selection, entities])

    return useMemo(() => ({
        ids: selection,
        entities: selectedEntities
    }), [selection, selectedEntities])
}

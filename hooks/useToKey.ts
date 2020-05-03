import {useMemo} from 'react'
import {FieldReference} from '../logic/fieldReferences'
import ObjectPathKey, {toKey} from '@bast1oncz/objects/ObjectPathKey'

/**
 * Uses object path key instance.
 * This method is great to prevent unnecessary updates.
 *
 * @param key
 */
export default function useToKey(key: FieldReference): ObjectPathKey {
    return useMemo(() => toKey(key), [key.toString()])
}

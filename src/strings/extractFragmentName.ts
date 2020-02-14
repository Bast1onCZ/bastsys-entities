/**
 * Extract name from a single fragment
 *
 * @param fragment - created by graphql tag
 * @returns {string}
 */
import {Fragment} from 'api/types'

export default function extractFragmentName(fragment: Fragment) {
    const defs = fragment.definitions as any

    return defs[0].name.value
}

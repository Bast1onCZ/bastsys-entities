import {Fragment} from '../api/types'
import pascalToReadableCase from '@bast1oncz/strings/pascalToReadableCase'
import extractFragmentName from '../strings/extractFragmentName'

/**
 * Extract fragment readable name for users
 *
 * @param fragment
 */
export function extractReadableFragmentName(fragment: Fragment) {
    return pascalToReadableCase(
        extractFragmentName(fragment)
    )
}

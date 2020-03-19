import useResettableState from '@bast1oncz/state/dist/useResettableState'
import useLeaveConfirm from 'leave-confirm/dist/useLeaveConfirm'

interface TempValueHookResult {
  tempValue: any,
  setTempValue: (any) => void,
  resetTempValue: () => void,
  isActive: boolean
}

/**
 * Hook to use tempValue.
 * Temp value is a state value, that is considered active when tempValue !== undefined.
 * If active, a leave confirm hook is used.
 * Can be set by setTempValue(value)
 * Can be deactivated by resetTempValue() or setTempValue(undefined)
 *
 * @param {string} leaveConfirmMessage
 * @returns {{resetTempValue: function, setTempValue: function, tempValue: any|undefined, isActive: boolean}}
 */
export default function useTempValue(leaveConfirmMessage: string): TempValueHookResult {
  const [tempValue, setTempValue, resetTempValue] = useResettableState(undefined)
  const isActive = tempValue !== undefined
  
  useLeaveConfirm(leaveConfirmMessage, isActive)
  
  return {
    tempValue,
    setTempValue,
    resetTempValue,
    isActive
  }
}

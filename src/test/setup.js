import '@testing-library/jest-dom'
import { beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// React 18+ Act 환경 설정
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// 각 테스트 후 정리
beforeEach(() => {
  // 테스트 전 설정
})

afterEach(() => {
  cleanup()
}) 
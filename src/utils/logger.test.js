import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logger } from './logger'

describe('Logger', () => {
  beforeEach(() => {
    // 각 테스트 전에 console 메서드를 모킹
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('info 메시지를 올바른 형식으로 로깅합니다', () => {
    logger.info('테스트 메시지')
    
    expect(console.info).toHaveBeenCalledWith('[INFO] 테스트 메시지')
  })

  it('warn 메시지를 올바른 형식으로 로깅합니다', () => {
    logger.warn('경고 메시지')
    
    expect(console.warn).toHaveBeenCalledWith('[WARN] 경고 메시지')
  })

  it('error 메시지를 올바른 형식으로 로깅합니다', () => {
    logger.error('에러 메시지')
    
    expect(console.error).toHaveBeenCalledWith('[ERROR] 에러 메시지')
  })

  it('추가 인자들과 함께 로깅할 수 있습니다', () => {
    const testData = { test: 'data' }
    logger.info('메시지', testData, 123)
    
    expect(console.info).toHaveBeenCalledWith('[INFO] 메시지', testData, 123)
  })
}) 
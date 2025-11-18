import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并Tailwind CSS类名的工具函数
 * 自动处理类名冲突和重复
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
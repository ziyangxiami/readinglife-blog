'use client'

import { Toaster } from 'sonner'

/**
 * Toast通知提供者组件
 * 在应用根组件中使用，提供全局的通知功能
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg',
          title: 'text-gray-900 dark:text-gray-100',
          description: 'text-gray-600 dark:text-gray-400',
          actionButton: 'bg-blue-500 hover:bg-blue-600 text-white',
          cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
          closeButton: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
        },
      }}
    />
  )
}
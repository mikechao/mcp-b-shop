import type { Component } from 'vue'

export interface ProductCategory {
  id: string
  label: string
  icon?: Component
  count?: number
}

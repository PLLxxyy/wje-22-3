export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}

export function formatCurrency(amount: number) {
  return `¥${amount.toLocaleString('zh-CN')}`
}

export const STATUS_LABELS: Record<string, string> = {
  viewing: '在看中',
  favorited: '已收藏',
  signed: '已签约'
}

export const STATUS_COLORS: Record<string, string> = {
  viewing: 'bg-blue-100 text-blue-700',
  favorited: 'bg-yellow-100 text-yellow-700',
  signed: 'bg-green-100 text-green-700'
}

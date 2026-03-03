export const formatCurrency = (value: number, cents = true) => {
  let newValue = value

  if (cents) {
    newValue /= 100
  }
  return `R$ ${newValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

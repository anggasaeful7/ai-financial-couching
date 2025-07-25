import { IndonesianBankingData } from './indonesian-data'

export interface MockAccount {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit'
  balance: number
  bank: {
    name: string
    code: string
    color: string
  }
  accountNumber: string
}

export interface MockTransaction {
  id: string
  amount: number
  description: string
  category: string
  date: Date
  merchantName: string
  accountId: string
}

export class MockBankingAPI {
  async connectAccounts(userId: string): Promise<MockAccount[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const accounts: MockAccount[] = [
      {
        id: `checking_${userId}`,
        name: 'Rekening Gaji',
        type: 'checking',
        balance: this.randomBetween(2000000, 15000000),
        bank: IndonesianBankingData.banks[0], // BCA
        accountNumber: this.generateAccountNumber()
      },
      {
        id: `savings_${userId}`,
        name: 'Tabungan Masa Depan',
        type: 'savings',
        balance: this.randomBetween(5000000, 25000000),
        bank: IndonesianBankingData.banks[1], // Mandiri
        accountNumber: this.generateAccountNumber()
      }
    ]

    return accounts
  }

  async getTransactions(accountId: string, days: number = 30): Promise<MockTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))

    const transactions: MockTransaction[] = []
    const transactionCount = this.randomBetween(20, 40)

    for (let i = 0; i < transactionCount; i++) {
      const daysAgo = Math.floor(Math.random() * days)
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)

      const category = this.randomFromArray(IndonesianBankingData.categories)
      const merchant = this.randomFromArray(IndonesianBankingData.merchants)
      const amount = -this.randomBetween(15000, 500000)

      transactions.push({
        id: `txn_${accountId}_${i}`,
        amount,
        description: `Transaksi di ${merchant}`,
        category,
        date,
        merchantName: merchant,
        accountId
      })
    }

    // Add some income transactions
    transactions.push({
      id: `salary_${accountId}`,
      amount: this.randomBetween(5000000, 15000000),
      description: 'Gaji Bulanan',
      category: 'Transfer',
      date: new Date(new Date().setDate(25)), // 25th of month
      merchantName: 'PT Perusahaan Indonesia',
      accountId
    })

    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private randomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  private generateAccountNumber(): string {
    return Math.random().toString().substr(2, 10)
  }
}
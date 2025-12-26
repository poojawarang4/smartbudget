import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

interface Transaction {
  id: string;
  icon: string,
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  month: number; // 0–11
  year: number;
}

@Component({
  selector: 'app-overview',
  imports: [NgChartsModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  isMobile = window.innerWidth < 600;
  public categoryTrendData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  public categoryTrendOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10
        }
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          minRotation: this.isMobile ? 90 : 0,
          maxRotation: this.isMobile ? 90 : 0,
          font: {
            size: this.isMobile ? 10 : 12
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `₹${value}`
        }
      }
    }
  };

  selectedYear = new Date().getFullYear();
  selectedMonthIndex = new Date().getMonth();
  expenseCategories: any[] = [
    {
      name: "Savings",
      sub: [
        "Savings",
      ]
    },
    {
      name: "Giving",
      sub: [
        "Giving",
      ]
    },
    {
      name: "Housing",
      sub: [
        "Mortgage",
        "Rent",
        "Water"
      ]
    },
    {
      name: "Transportation",
      sub: ["Fuel", "Insurance", "Maintenance"]
    },
    {
      name: "Food",
      sub: ["Groceries", "Restaurants"]
    },
    {
      name: "Personal",
      sub: [
        "Personal",
      ]
    },
    {
      name: "Insurance",
      sub: ["Health", "Life"]
    },
    {
      name: "Loan Repayment",
      sub: [
        "Loan Repayment",
      ]
    },
    {
      name: "Entertainment",
      sub: [
        "Entertainment",
      ]
    },
    {
      name: "Child Care",
      sub: [
        "Child Care",
      ]
    }
  ];

  ngOnInit() {
    this.categoryTrendData = this.buildCategoryWiseMonthlyData();
  }

  buildCategoryWiseMonthlyData() {
    const data = JSON.parse(
      localStorage.getItem('smartbudget-data') || '{"transactions":[]}'
    );
    const months = this.getMonthsTillCurrent(
      this.selectedYear,
      this.selectedMonthIndex
    );
    // Main categories
    const categories = this.expenseCategories.map(c => c.name);
    // Init structure
    const categoryMap: any = {};
    categories.forEach(cat => {
      categoryMap[cat] = months.map(() => 0);
    });
    // Aggregate transactions
    data.transactions.forEach((t: Transaction) => {
      if (
        t.type !== 'expense' ||
        t.year !== this.selectedYear ||
        t.month > this.selectedMonthIndex
      ) return;
      const main = this.getMainCategory(t.category);
      if (!categoryMap[main]) return;
      categoryMap[main][t.month] += t.amount;
    });
    return {
      labels: months.map(m => m.label),
      datasets: categories.map((cat, index) => ({
        label: cat,
        data: categoryMap[cat],
        borderWidth: 2,
        fill: false
      }))
    };
  }

  getMonthsTillCurrent(year: number, monthIndex: number) {
    const months = [];
    for (let m = 0; m <= monthIndex; m++) {
      months.push({
        year,
        month: m,
        label: `${this.getMonthName(m).slice(0, 3)}`
      });
    }
    return months;
  }

  getMonthName(index: number) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[index];
  }

  getMainCategory(category: string): string {
    for (let item of this.expenseCategories) {
      // if main category matches
      if (item.name === category) return item.name;
      // if subcategory matches, return main category
      if (item.sub && item.sub.includes(category)) {
        return item.name;
      }
    }
    return category; // for income or unmatched categories
  }
}

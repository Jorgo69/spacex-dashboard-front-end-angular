import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Spacex } from '../../services/spacex';
import { Auth } from '../../services/auth';
import { DashboardData, Launch, YearStat } from '../../models/spacex.model';

// Enregistrer les composants nécessaires
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  private spacex = inject(Spacex);
  private auth = inject(Auth);

  // Données principales
  kpi: any = null;
  statsByYear: YearStat[] = [];
  allLaunches: Launch[] = [];
  filteredLaunches: Launch[] = [];
  launches: Launch[] = [];

  // États
  availableYears: string[] = [];
  userRole: 'user' | 'admin' = 'user';
  loading = true;
  error: string | null = null;

  // Filtres et pagination
  filters = { year: '', success: '', search: '' };
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  // Graphiques
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: { 
        type: 'category',
        title: { display: true, text: 'Year' } 
      },
      y: { 
        type: 'linear',
        title: { display: true, text: 'Launches' }, 
        beginAtZero: true 
      }
    },
    plugins: { legend: { display: false } }
  };
  
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ 
      data: [], 
      label: 'Launches per Year', 
      backgroundColor: '#3b82f6' 
    }]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'category'
      },
      y: { 
        type: 'linear',
        min: 0, 
        max: 100, 
        title: { display: true, text: 'Success Rate (%)' } 
      }
    },
    plugins: { legend: { display: false } }
  };
  
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Success Rate',
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.2)',
      tension: 0.3,
      fill: true
    }]
  };

  ngOnInit(): void {
    this.userRole = this.auth.getUser()?.role || 'user';
    this.loadDashboard();
  }

  private extractYears(launches: Launch[]): void {
    this.availableYears = Array.from(
      new Set(
        launches
          .filter(l => l.date_utc)
          .map(l => new Date(l.date_utc).getFullYear().toString())
      )
    ).sort((a, b) => parseInt(b) - parseInt(a));
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;
    this.spacex.getDashboard().subscribe({
      next: (data: DashboardData) => {
        this.kpi = data.kpi;
        this.statsByYear = data.stats_by_year;
        this.allLaunches = data.launches;
        this.extractYears(this.allLaunches);
        this.applyFilters();
        this.updateCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement dashboard', err);
        this.error = 'Impossible de charger les données.';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.allLaunches];

    // filtre année
    if (this.filters.year) {
      filtered = filtered.filter(
        l => new Date(l.date_utc).getFullYear().toString() === this.filters.year
      );
    }

    // filtre succès
    if (this.filters.success) {
      const isSuccess = this.filters.success === 'true';
      filtered = filtered.filter(l => l.success === isSuccess);
    }

    // recherche globale
    if (this.filters.search.trim() !== '') {
      const term = this.filters.search.toLowerCase();
      filtered = filtered.filter(l =>
        (l.name?.toLowerCase().includes(term) ||
         l.details?.toLowerCase().includes(term) ||
         new Date(l.date_utc).toLocaleDateString().toLowerCase().includes(term) ||
         (l.success ? 'success' : 'failure').includes(term) ||
         l.rocket?.toLowerCase().includes(term))
      );
    }

    this.filteredLaunches = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePage();
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.launches = this.filteredLaunches.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  onResync(): void {
    if (this.userRole !== 'admin') return;
    this.spacex.resync().subscribe({
      next: () => this.loadDashboard(),
      error: (err) => console.error('Échec resync', err),
    });
  }

  private updateCharts(): void {
    const stats = [...this.statsByYear].sort((a, b) => Number(a.year) - Number(b.year));

    this.barChartData.labels = stats.map(s => s.year);
    this.barChartData.datasets[0].data = stats.map(s => s.total);

    this.lineChartData.labels = stats.map(s => s.year);
    this.lineChartData.datasets[0].data = stats.map(s => s.success_rate);
  }
}
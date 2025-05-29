export interface Filters {
  showCompleted: boolean;
  priorities: string[];
  categories: string[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}
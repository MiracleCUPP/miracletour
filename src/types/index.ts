export type PackageType = 'common' | 'premium' | 'diamond';
export type TournamentStatus = 'active' | 'completed' | 'upcoming';
export type ApplicationStatus = 'pending' | 'processed' | 'rejected';

export interface Team {
  id: string;
  name: string;
  logo?: string;
}

export interface PlayerRating {
  id: string;
  name: string;
  team: string;
  score: number;
  kills?: number;
  deaths?: number;
}

export interface BracketMatch {
  id: string;
  round: number;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  winner?: string;
}

export interface GroupTableEntry {
  id: string;
  team: string;
  wins: number;
  losses: number;
}

export interface Tournament {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  format: string;
  description: string;
  fullDescription?: string;
  banner: string;
  package: PackageType;
  teams: Team[];
  bracket: BracketMatch[];
  groupTable?: GroupTableEntry[];
  playerRatings?: PlayerRating[];
  status: TournamentStatus;
  telegramLink: string;
  prizePool?: string;
  game?: string;
  createdAt: string;
}

export interface News {
  id: string;
  title: string;
  date: string;
  image: string;
  shortText: string;
  fullText: string;
  isPinned: boolean;
  createdAt: string;
}

export interface Application {
  id: string;
  organizerName: string;
  tournamentName: string;
  package: PackageType;
  telegram: string;
  email?: string;
  description: string;
  status: ApplicationStatus;
  createdAt: string;
  notes?: string;
}

export interface Admin {
  username: string;
  password: string;
}

export interface SiteSettings {
  logo: string;
  logoType: 'text' | 'image' | 'emoji';
  organizationName: string;
}

export const PACKAGES = {
  common: {
    name: 'Common',
    price: 100,
    features: [
      'Небольшое оформление + поддержка кодером',
      'Ссылка на ваш Telegram-канал',
      'Реклама присутствует со стороны организации',
      'Турнир будет ниже всего по рекламе на сайте',
      'Только сетка + название команд без логотипов',
      'Турнир может длится до 5 дней после плата доп дни'
    ],
    color: 'gray'
  },
  premium: {
    name: 'Premium',
    price: 250,
    features: [
      'Оформление + поддержка кодером',
      'Ссылка на ваш Telegram-канал',
      'Реклама присутствует со стороны организации',
      'Приоритет на главной странице сайта',
      'Турнирная таблица / сетка + название команд с логотипами',
      'Остается на сайте навсегда',
      'Публикуется также во вкладке "Завершено"',
      'Турнир может длится до 10 дней после плата доп дни'
    ],
    color: 'white'
  },
  diamond: {
    name: 'Diamond',
    price: 500,
    features: [
      'Все преимущества пакетов ниже',
      'Добавление рейтинга игроков/команд на турнире',
      'Приоритет поддержки кодером',
      'Скидка на следующий пакет 10%',
      'Без рекламы организации',
      'Добавление до 2 ваших идей',
      'Турнир может длится до 15 дней после плата доп дни'
    ],
    color: 'gradient'
  }
} as const;

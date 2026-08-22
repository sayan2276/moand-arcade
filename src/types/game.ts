export interface ScoreSelector {
    type: 'localStorage' | 'globalVar' | 'postMessage';
    key?: string;
    path?: string;
    varName?: string;
}

export interface AchievementTier {
    id: string;
    title: string;
    description: string;
    scoreThreshold: number;
    rewardPoints: number;
}

export interface GameItem {
    id: string;
    title: string;
    description: string;
    category: 'Arcade' | 'Physics' | 'Puzzle' | 'Platformer' | 'Action' | 'Sports' | 'Casual';
    thumbnail: string;
    path: string;
    controls: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    scoreSelector: ScoreSelector;
    scoreUnit: string;
    achievements: AchievementTier[];
}

export interface GameCompletedMessage {
    type: 'GAME_COMPLETED';
    gameId: string;
    score: number;
}

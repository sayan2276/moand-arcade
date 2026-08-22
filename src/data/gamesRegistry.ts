import { GameItem } from '../types/game';

export const GAMES_REGISTRY: GameItem[] = [
    {
        id: 'evilglitch',
        title: 'Evil Glitch',
        description: 'Retro arcade shooter. Fight the corruption in this retro glitch grid!',
        category: 'Arcade',
        thumbnail: '⚡',
        path: '/games/evilglitch.html',
        controls: 'WASD to move, Mouse Click to shoot',
        difficulty: 'Hard',
        scoreUnit: 'pts',
        scoreSelector: {
            type: 'globalVar',
            varName: 'J'
        },
        achievements: [
            { id: 'eg-1', title: 'Glitch Runner', description: 'Score 500+ points', scoreThreshold: 500, rewardPoints: 10 },
            { id: 'eg-2', title: 'System Master', description: 'Score 2,000+ points', scoreThreshold: 2000, rewardPoints: 25 },
            { id: 'eg-3', title: 'Glitch Destroyer', description: 'Score 5,000+ points', scoreThreshold: 5000, rewardPoints: 60 }
        ]
    },
    {
        id: 'spacebarclicker',
        title: 'Spacebar Clicker',
        description: 'The ultimate spacebar clicker! Upgrade monkeys, boomers, and laser guns.',
        category: 'Casual',
        thumbnail: '⌨️',
        path: '/games/spacebarclicker.html',
        controls: 'Spacebar or Tap to click',
        difficulty: 'Easy',
        scoreUnit: 'clicks',
        scoreSelector: {
            type: 'localStorage',
            key: 'spacebar_clicker_game',
            path: 'v'
        },
        achievements: [
            { id: 'sc-1', title: 'Key Basher', description: 'Reach 100 total clicks', scoreThreshold: 100, rewardPoints: 5 },
            { id: 'sc-2', title: 'Automation Era', description: 'Reach 1,000 total clicks', scoreThreshold: 1000, rewardPoints: 20 },
            { id: 'sc-3', title: 'Spacebar Overlord', description: 'Reach 10,000 total clicks', scoreThreshold: 10000, rewardPoints: 50 }
        ]
    },
    {
        id: 'doodlejump',
        title: 'Doodle Jump',
        description: 'Jump to the top on moving platforms! Collect boosts and avoid monsters.',
        category: 'Platformer',
        thumbnail: '✏️',
        path: '/games/doodlejump.html',
        controls: 'Arrow keys or Swipe Left/Right',
        difficulty: 'Medium',
        scoreUnit: 'm',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'dj-1', title: 'High Jumper', description: 'Reach height of 500', scoreThreshold: 500, rewardPoints: 10 },
            { id: 'dj-2', title: 'Cloud Surfer', description: 'Reach height of 1,500', scoreThreshold: 1500, rewardPoints: 30 },
            { id: 'dj-3', title: 'Space Leaper', description: 'Reach height of 3,500', scoreThreshold: 3500, rewardPoints: 70 }
        ]
    },
    {
        id: 'stack',
        title: 'Stack',
        description: 'Stack blocks as high as you can in rhythm. Precise timing is everything!',
        category: 'Puzzle',
        thumbnail: '🧱',
        path: '/games/stack.html',
        controls: 'Space / Tap screen to place block',
        difficulty: 'Medium',
        scoreUnit: 'blocks',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'st-1', title: 'Tower Builder', description: 'Stack 15 blocks', scoreThreshold: 15, rewardPoints: 10 },
            { id: 'st-2', title: 'Skyscraper', description: 'Stack 35 blocks', scoreThreshold: 35, rewardPoints: 25 },
            { id: 'st-3', title: 'Architect God', description: 'Stack 70 blocks', scoreThreshold: 70, rewardPoints: 60 }
        ]
    },
    {
        id: 'drivemad',
        title: 'Drive Mad',
        description: 'Drive your truck through crazy obstacle courses without flipping over!',
        category: 'Physics',
        thumbnail: '🚚',
        path: '/games/drivemad.htm',
        controls: 'WASD / Arrow keys or Touch pedal',
        difficulty: 'Hard',
        scoreUnit: 'lvl',
        scoreSelector: {
            type: 'globalVar',
            varName: 'level'
        },
        achievements: [
            { id: 'dm-1', title: 'First Gear', description: 'Complete Level 1', scoreThreshold: 1, rewardPoints: 5 },
            { id: 'dm-2', title: 'Stunt Driver', description: 'Reach Level 5', scoreThreshold: 5, rewardPoints: 30 },
            { id: 'dm-3', title: 'Drive Master', description: 'Reach Level 10', scoreThreshold: 10, rewardPoints: 75 }
        ]
    },
    {
        id: 'paperio',
        title: 'Paper.io',
        description: 'Conquer as much land as possible. Cut off opponent trails to eliminate them!',
        category: 'Arcade',
        thumbnail: '📜',
        path: '/games/paperio.htm',
        controls: 'Arrow keys / Mouse drag',
        difficulty: 'Medium',
        scoreUnit: '%',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'pio-1', title: 'Land Owner', description: 'Claim 5% territory', scoreThreshold: 5, rewardPoints: 10 },
            { id: 'pio-2', title: 'King of Paper', description: 'Claim 20% territory', scoreThreshold: 20, rewardPoints: 35 }
        ]
    },
    {
        id: 'drawclimber',
        title: 'Draw Climber',
        description: 'Draw legs for your cube to sprint and climb over obstacles in racing action.',
        category: 'Physics',
        thumbnail: '🖌️',
        path: '/games/drawclimber.html',
        controls: 'Draw on bottom canvas area',
        difficulty: 'Easy',
        scoreUnit: 'pts',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'dc-1', title: 'Doodler', description: 'Score 200 points', scoreThreshold: 200, rewardPoints: 10 }
        ]
    },
    {
        id: 'getontop',
        title: 'Get On Top',
        description: 'Ragdoll wrestling! Force your opponent head to hit the ground first.',
        category: 'Physics',
        thumbnail: '🤼',
        path: '/games/getontop.html',
        controls: 'WASD / Arrow Keys',
        difficulty: 'Medium',
        scoreUnit: 'wins',
        scoreSelector: {
            type: 'globalVar',
            varName: 'p1Score'
        },
        achievements: [
            { id: 'got-1', title: 'Wrestler', description: 'Win 3 rounds', scoreThreshold: 3, rewardPoints: 15 }
        ]
    },
    {
        id: 'johnnytrigger',
        title: 'Johnny Trigger',
        description: 'Slow-motion parkour shooting action! Time your shots perfectly.',
        category: 'Action',
        thumbnail: '🕶️',
        path: '/games/johnnytrigger.html',
        controls: 'Tap / Click to shoot',
        difficulty: 'Medium',
        scoreUnit: 'kills',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'jt-1', title: 'Sharp Shooter', description: 'Eliminate 10 enemies', scoreThreshold: 10, rewardPoints: 15 }
        ]
    },
    {
        id: 'jumpingshell',
        title: 'Jumping Shell',
        description: 'Shell-shedding puzzle platformer! Strip layers to jump higher.',
        category: 'Platformer',
        thumbnail: '🐚',
        path: '/games/jumpingshell.html',
        controls: 'Arrow keys + Space to shed shell',
        difficulty: 'Hard',
        scoreUnit: 'level',
        scoreSelector: {
            type: 'globalVar',
            varName: 'currentLevel'
        },
        achievements: [
            { id: 'js-1', title: 'Out of Shell', description: 'Pass level 3', scoreThreshold: 3, rewardPoints: 20 }
        ]
    },
    {
        id: 'minesweeper',
        title: 'Minesweeper',
        description: 'Classic logic mine detection. Uncover numbers and flag all hidden bombs.',
        category: 'Puzzle',
        thumbnail: '💣',
        path: '/games/minesweeper.html',
        controls: 'Left click reveal, Right click flag',
        difficulty: 'Medium',
        scoreUnit: 'cleared',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'ms-1', title: 'Sweeper', description: 'Clear 15 tiles', scoreThreshold: 15, rewardPoints: 15 }
        ]
    },
    {
        id: 'oppositeday',
        title: 'Opposite Day',
        description: 'Nothing is as it seems! Left goes right, jumping drops you down.',
        category: 'Platformer',
        thumbnail: '🙃',
        path: '/games/oppositeday.html',
        controls: 'Arrow keys (Reverse logic)',
        difficulty: 'Hard',
        scoreUnit: 'pts',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'od-1', title: 'Reverse Genius', description: 'Score 100 points', scoreThreshold: 100, rewardPoints: 20 }
        ]
    },
    {
        id: 'pixelspeedrun',
        title: 'Pixel Speedrun',
        description: 'Precision 8-bit platform speedrunning against the ticking clock!',
        category: 'Platformer',
        thumbnail: '🏃',
        path: '/games/pixelspeedrun.html',
        controls: 'WASD / Arrow Keys',
        difficulty: 'Hard',
        scoreUnit: 'sec',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'ps-1', title: 'Speedy Pixel', description: 'Survive 30 seconds', scoreThreshold: 30, rewardPoints: 15 }
        ]
    },
    {
        id: 'sandgame',
        title: 'Sand Game',
        description: 'Cellular automata physics sandbox. Mix water, fire, sand, and acid.',
        category: 'Casual',
        thumbnail: '⏳',
        path: '/games/sandgame.html',
        controls: 'Mouse draw / Touch drag',
        difficulty: 'Easy',
        scoreUnit: 'elements',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'sg-1', title: 'Alchemist', description: 'Place 500 sand particles', scoreThreshold: 500, rewardPoints: 10 }
        ]
    },
    {
        id: 'soccerrandom',
        title: 'Soccer Random',
        description: 'One-button crazy physics soccer! Score goals with unpredictable ragdolls.',
        category: 'Sports',
        thumbnail: '⚽',
        path: '/games/soccerrandom.htm',
        controls: 'Up Arrow / Tap Screen',
        difficulty: 'Medium',
        scoreUnit: 'goals',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'sr-1', title: 'Golden Boot', description: 'Score 5 goals', scoreThreshold: 5, rewardPoints: 15 }
        ]
    },
    {
        id: 'tinyfishing',
        title: 'Tiny Fishing',
        description: 'Cast your line, reel in fish, and upgrade your gear for deep sea treasures.',
        category: 'Casual',
        thumbnail: '🎣',
        path: '/games/tinyfishing.html',
        controls: 'Click/Touch & drag hook',
        difficulty: 'Easy',
        scoreUnit: '$',
        scoreSelector: {
            type: 'globalVar',
            varName: 'cash'
        },
        achievements: [
            { id: 'tf-1', title: 'Angler', description: 'Earn $100 from catches', scoreThreshold: 100, rewardPoints: 10 }
        ]
    },
    {
        id: 'trapthecat',
        title: 'Trap The Cat',
        description: 'Hexagon puzzle! Block tiles to trap the cat before it reaches the grid edge.',
        category: 'Puzzle',
        thumbnail: '🐱',
        path: '/games/trapthecat.html',
        controls: 'Click tiles to block cat',
        difficulty: 'Hard',
        scoreUnit: 'wins',
        scoreSelector: {
            type: 'globalVar',
            varName: 'trappedCount'
        },
        achievements: [
            { id: 'tc-1', title: 'Cat Catcher', description: 'Trap the cat 1 time', scoreThreshold: 1, rewardPoints: 20 }
        ]
    },
    {
        id: 'ballz',
        title: 'Ballz',
        description: 'Swipe to shoot balls and break numbered bricks before they hit the bottom.',
        category: 'Arcade',
        thumbnail: '⚪',
        path: '/games/ballz.htm',
        controls: 'Drag aim & release',
        difficulty: 'Medium',
        scoreUnit: 'score',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'bz-1', title: 'Brick Buster', description: 'Reach score 20', scoreThreshold: 20, rewardPoints: 15 }
        ]
    },
    {
        id: 'we_become_what_we_behold',
        title: 'We Become What We Behold',
        description: 'Interactive editorial game about news cycles, media, and human behavior.',
        category: 'Casual',
        thumbnail: '📷',
        path: '/games/we_become_what_we_behold.htm',
        controls: 'Click camera framing box',
        difficulty: 'Easy',
        scoreUnit: 'photos',
        scoreSelector: {
            type: 'globalVar',
            varName: 'score'
        },
        achievements: [
            { id: 'wb-1', title: 'Media Photographer', description: 'Capture 5 news moments', scoreThreshold: 5, rewardPoints: 10 }
        ]
    }
];

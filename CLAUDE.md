# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Psychological Training System (PsyTraining)** - a cognitive assessment platform that integrates HTML-based mini-games for psychological measurement and training. The system uses a decoupled architecture where games operate independently while reporting data to a centralized training framework.

## Development Commands

This is a static HTML/CSS/JavaScript project with no build process or package manager. Development commands:

**Running the Application:**
- Open `PsyTraining/index.html` directly in a browser, or
- Use a local HTTP server: `python -m http.server 8000` (then visit `http://localhost:8000/PsyTraining/`)

**Testing Games:**
- Individual games: Open `PsyTraining/[game-name]-game.html` directly
- Always test with browser console open to view cognitive metrics output

**No build, test, or lint commands** - this is a client-side only application.

## Architecture Overview

### Core System Structure
```
PsyTraining/
├── game-template/              # Core training framework
│   ├── template.html          # UI template for game pages
│   ├── template.css           # Shared styling system
│   └── template.js            # Training system controller (760+ lines)
├── games/                     # Individual game implementations
│   ├── snake/                # Reference implementation
│   └── [other-games]/        # Additional cognitive games
├── [game-name]-game.html     # Game launcher pages
└── index.html                # Main menu/dashboard
```

### Decoupled Architecture Pattern

**Training System (`template.js`):**
- Manages training sessions, timing, and data collection
- Provides `TrainingAPI` interface for games
- Handles cognitive metrics aggregation and JSON output
- Controls training flow (start, pause, resume, end)

**Game Systems (e.g., `games/snake/game.js`):**
- Independent game logic and rendering
- Implements standardized event handling interface
- Reports structured data to training system
- Calculates domain-specific cognitive metrics

### Key Integration Points

**Required Game Interface:**
```javascript
class YourGame {
    handleTrainingEvent(eventDetail) {
        // Handle: 'training_start', 'training_pause', 'training_resume', 'training_end'
    }
    
    reportToTrainingSystem() {
        // Report data via window.TrainingAPI.reportGameData(report)
    }
    
    calculateCognitiveMetrics() {
        // Return cognitive assessment data
    }
}
```

**Event Communication:**
- Training system broadcasts via `window.dispatchEvent(new CustomEvent('trainingSystemEvent'))`
- Games listen with `window.addEventListener('trainingSystemEvent')`
- Games report back via `window.TrainingAPI.reportGameData()`

## Cognitive Assessment Framework

The system implements a comprehensive **5-domain cognitive assessment model**:

1. **Executive Function** - Planning ability, cognitive flexibility, impulse control
2. **Attention** - Sustained attention, selective attention, divided attention  
3. **Learning & Memory** - Working memory, learning ability, pattern recognition
4. **Processing Speed** - Reaction time, decision making, information processing
5. **Spatial Cognition** - Spatial memory, orientation, visual-spatial skills

### Data Output Format
Games generate structured JSON data logged to browser console:
```javascript
{
    "trainingInfo": { /* session metadata */ },
    "gameDataSummary": { /* aggregated statistics */ },
    "cognitiveAnalysis": { /* 5-domain assessment */ },
    "detailedGameReports": [ /* raw game data */ ]
}
```

## Game Integration Process

### Adding New Games (5-step process):

1. **Create game directory**: `games/[game-name]/` with `game.html`, `game.css`, `game.js`
2. **Implement game class** with required interface methods
3. **Create launcher page**: `[game-name]-game.html` using template structure
4. **Add to main menu**: Update `index.html` with game card
5. **Test integration**: Verify training flow and data output

### Critical Implementation Requirements:

**Event Handling:**
- Always use `event.preventDefault()` for arrow keys to prevent page scrolling
- Only record key events, avoid high-frequency data logging
- Implement proper pause/resume game state management

**Data Structure:**
- Use standardized round data format with timestamps, scores, events
- Calculate cognitive metrics based on game type and interactions
- Ensure JSON output is valid and complete

**UI Integration:**
- Games must integrate with standard control bar (pause, end, timer)
- Follow responsive design patterns from template.css
- Include game instructions and cognitive training objectives

## Code Conventions

- **File Naming**: Use kebab-case (`memory-cards-game.html`)
- **Class Names**: PascalCase (`SnakeGame`, `MemoryCardsGame`) 
- **Methods**: camelCase (`handleKeyDown`, `calculateCognitiveMetrics`)
- **No Build Tools**: Direct JavaScript, no transpilation or bundling
- **Browser Compatibility**: Modern browsers, ES6+ features used

## Important Notes

- **No Server Required**: Fully client-side application
- **Console Output Critical**: All assessment data outputs to browser console as JSON
- **Training Duration**: System recommends minimum 3-minute sessions for valid data
- **Multi-Round Support**: Games should support multiple rounds within single training session
- **Cognitive Focus**: This is a psychological assessment tool, not entertainment software

## Reference Implementation

Study `games/snake/game.js` as the complete reference for:
- Training event handling patterns
- Cognitive metrics calculation methods
- Data reporting structure
- Game state management
- Performance optimization techniques

The Snake game demonstrates full integration with the training framework and proper cognitive assessment data generation.
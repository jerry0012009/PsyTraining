/**
 * Color Blast游戏 - 集成到认知训练系统
 * 简洁版本，专注于核心功能和数据记录
 */

class ColorBlastGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameConfig = {
            width: 960,
            height: 540
        };
        
        this.gameState = {
            isRunning: false,
            isPaused: false,
            currentRound: 0,
            score: 0,
            lives: 3,
            maxLives: 3,
            player: null,
            enemies: [],
            bullets: [],
            enemyBullets: [],
            particles: [],
            currentFrame: 0
        };
        
        this.gameData = {
            rounds: [],
            currentRoundData: null,
            totalScore: 0,
            totalEnemiesDestroyed: 0,
            totalShotsFired: 0
        };
        
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        // 创建画布
        this.canvas = document.getElementById('color-blast-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 监听训练系统事件
        window.addEventListener('trainingSystemEvent', (event) => {
            this.handleTrainingEvent(event.detail);
        });
        
        this.showWaitingState();
    }

    handleTrainingEvent(eventDetail) {
        const { event } = eventDetail;
        
        switch (event) {
            case 'training_start':
                this.startFirstRound();
                break;
            case 'training_pause':
                this.pauseGame();
                break;
            case 'training_resume':
                this.resumeGame();
                break;
            case 'training_end':
                this.endAllRounds();
                break;
        }
    }

    showWaitingState() {
        this.clear();
        this.ctx.fillStyle = "#4cffd7";
        this.ctx.textAlign = "center";
        this.ctx.font = "bold 24px Arial, sans-serif";
        this.ctx.fillText("COLOR BLAST", this.gameConfig.width / 2, this.gameConfig.height / 2 - 20);
        this.ctx.font = "16px Arial, sans-serif";
        this.ctx.fillText("等待训练开始...", this.gameConfig.width / 2, this.gameConfig.height / 2 + 20);
    }

    startFirstRound() {
        this.gameState.currentRound++;
        this.gameState.isRunning = true;
        this.gameState.isPaused = false;
        
        this.gameData.currentRoundData = {
            roundNumber: this.gameState.currentRound,
            startTime: Date.now(),
            endTime: null,
            duration: 0,
            score: 0,
            events: [],
            enemiesDestroyed: 0,
            shotsFired: 0,
            livesLost: 0
        };
        
        this.resetGame();
        this.updateScoreDisplay();
        this.gameLoop();
        
        this.recordEvent('round_started');
    }

    resetGame() {
        this.gameState.score = 0;
        this.gameState.lives = this.gameState.maxLives;
        this.gameState.enemies = [];
        this.gameState.bullets = [];
        this.gameState.enemyBullets = [];
        this.gameState.particles = [];
        this.gameState.currentFrame = 0;
        
        // 创建玩家
        this.gameState.player = {
            x: this.gameConfig.width / 2 - 30,
            y: this.gameConfig.height - 40,
            width: 60,
            height: 20,
            speed: 8,
            movingLeft: false,
            movingRight: false,
            invincible: false
        };
        
        // 创建敌人
        for (let i = 0; i < 6; i++) {
            this.createEnemy();
        }
    }

    createEnemy() {
        const enemy = {
            x: Math.random() * (this.gameConfig.width - 60),
            y: Math.random() * 30 + 10,
            width: 60,
            height: 20,
            speed: Math.random() * 2 + 1,
            vy: Math.random() * 0.2 + 0.1,
            movingLeft: Math.random() < 0.5,
            shootingSpeed: Math.floor(Math.random() * 50) + 30,
            color: `hsl(${Math.random() * 360}, 60%, 50%)`
        };
        this.gameState.enemies.push(enemy);
    }

    pauseGame() {
        if (this.gameState.isRunning) {
            this.gameState.isPaused = true;
            this.gameState.isRunning = false;
            this.showPausedMessage();
        }
    }

    resumeGame() {
        if (this.gameState.isPaused) {
            this.gameState.isPaused = false;
            this.gameState.isRunning = true;
            this.gameLoop();
        }
    }

    endCurrentRound() {
        if (!this.gameData.currentRoundData) return;
        
        this.gameState.isRunning = false;
        this.gameData.currentRoundData.endTime = Date.now();
        this.gameData.currentRoundData.duration = 
            this.gameData.currentRoundData.endTime - this.gameData.currentRoundData.startTime;
        this.gameData.currentRoundData.score = this.gameState.score;
        
        this.gameData.rounds.push({...this.gameData.currentRoundData});
        this.gameData.totalScore += this.gameState.score;
        
        this.recordEvent('round_ended');
        this.showRoundOverMessage();
        this.reportToTrainingSystem();
    }

    endAllRounds() {
        if (this.gameState.isRunning && this.gameData.currentRoundData) {
            this.endCurrentRound();
        }
        
        this.gameState.isRunning = false;
        this.clear();
        this.ctx.fillStyle = "#e74c3c";
        this.ctx.textAlign = "center";
        this.ctx.font = "bold 24px Arial, sans-serif";
        this.ctx.fillText("训练结束", this.gameConfig.width / 2, this.gameConfig.height / 2);
    }

    showPausedMessage() {
        this.clear();
        this.ctx.fillStyle = "#f39c12";
        this.ctx.textAlign = "center";
        this.ctx.font = "bold 24px Arial, sans-serif";
        this.ctx.fillText("游戏已暂停", this.gameConfig.width / 2, this.gameConfig.height / 2);
    }

    showRoundOverMessage() {
        this.clear();
        this.ctx.fillStyle = "#4cffd7";
        this.ctx.textAlign = "center";
        this.ctx.font = "bold 24px Arial, sans-serif";
        this.ctx.fillText("ROUND OVER", this.gameConfig.width / 2, this.gameConfig.height / 2 - 40);
        this.ctx.font = "16px Arial, sans-serif";
        this.ctx.fillText(`得分: ${this.gameState.score}`, this.gameConfig.width / 2, this.gameConfig.height / 2 - 10);
        this.ctx.fillText("按空格键开始新一轮", this.gameConfig.width / 2, this.gameConfig.height / 2 + 20);
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
            event.preventDefault();
        }
        
        if (event.code === 'Space') {
            if (!this.gameState.isRunning && !this.gameState.isPaused && 
                window.TrainingAPI && TrainingAPI.getTrainingStatus() === 'training') {
                this.startFirstRound();
            } else if (this.gameState.isRunning && !this.gameState.isPaused) {
                this.playerShoot();
            }
            return;
        }
        
        if (!this.gameState.isRunning || this.gameState.isPaused) return;
        
        const player = this.gameState.player;
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                player.movingLeft = true;
                this.recordEvent('move_left');
                break;
            case 'ArrowRight':
            case 'KeyD':
                player.movingRight = true;
                this.recordEvent('move_right');
                break;
        }
    }

    handleKeyUp(event) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
            event.preventDefault();
        }
        
        const player = this.gameState.player;
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                player.movingLeft = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                player.movingRight = false;
                break;
        }
    }

    playerShoot() {
        if (!this.gameState.player.invincible) {
            const bullet = {
                x: this.gameState.player.x + this.gameState.player.width / 2 - 4,
                y: this.gameState.player.y,
                width: 8,
                height: 20,
                vy: -8,
                color: "white"
            };
            this.gameState.bullets.push(bullet);
            this.gameData.currentRoundData.shotsFired++;
            this.recordEvent('player_shot');
        }
    }

    gameLoop() {
        if (!this.gameState.isRunning) return;
        
        this.clear();
        this.updateGame();
        this.drawGame();
        this.checkCollisions();
        
        this.gameState.currentFrame++;
        requestAnimationFrame(() => this.gameLoop());
    }

    clear() {
        this.ctx.fillStyle = "rgba(20,20,20,.7)";
        this.ctx.fillRect(0, 0, this.gameConfig.width, this.gameConfig.height);
    }

    updateGame() {
        // 更新玩家
        const player = this.gameState.player;
        if (player.movingLeft && player.x > 0) player.x -= player.speed;
        if (player.movingRight && player.x + player.width < this.gameConfig.width) {
            player.x += player.speed;
        }
        
        // 更新子弹
        this.gameState.bullets = this.gameState.bullets.filter(bullet => {
            bullet.y += bullet.vy;
            return bullet.y > -bullet.height;
        });
        
        // 更新敌人子弹
        this.gameState.enemyBullets = this.gameState.enemyBullets.filter(bullet => {
            bullet.y += bullet.vy;
            return bullet.y < this.gameConfig.height;
        });
        
        // 更新敌人
        this.gameState.enemies.forEach(enemy => {
            if (enemy.movingLeft) {
                enemy.x -= enemy.speed;
                if (enemy.x <= 0) enemy.movingLeft = false;
            } else {
                enemy.x += enemy.speed;
                if (enemy.x + enemy.width >= this.gameConfig.width) enemy.movingLeft = true;
            }
            enemy.y += enemy.vy;
            
            // 敌人射击
            if (this.gameState.currentFrame % enemy.shootingSpeed === 0) {
                const bullet = {
                    x: enemy.x + enemy.width / 2 - 4,
                    y: enemy.y + enemy.height,
                    width: 8,
                    height: 20,
                    vy: 6,
                    color: enemy.color
                };
                this.gameState.enemyBullets.push(bullet);
            }
        });
        
        // 更新粒子
        this.gameState.particles = this.gameState.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1;
            particle.life -= 0.02;
            particle.size *= 0.95;
            return particle.life > 0;
        });
    }

    drawGame() {
        // 绘制玩家
        const player = this.gameState.player;
        if (!player.invincible || this.gameState.currentFrame % 20 === 0) {
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(player.x, player.y, player.width, player.height);
        }
        
        // 绘制敌人
        this.gameState.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
        
        // 绘制子弹
        this.gameState.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        this.gameState.enemyBullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        // 绘制粒子
        this.gameState.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            this.ctx.globalAlpha = 1;
        });
        
        // 绘制UI
        this.drawUI();
    }

    drawUI() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial, sans-serif";
        this.ctx.fillText(`得分: ${this.gameState.score}`, 8, 20);
        this.ctx.fillText(`生命: ${this.gameState.lives}`, 8, 40);
    }

    checkCollisions() {
        const player = this.gameState.player;
        
        // 玩家子弹击中敌人
        this.gameState.bullets.forEach((bullet, bulletIndex) => {
            this.gameState.enemies.forEach((enemy, enemyIndex) => {
                if (this.collision(bullet, enemy)) {
                    this.gameState.score += 15;
                    this.gameData.currentRoundData.enemiesDestroyed++;
                    this.gameData.totalEnemiesDestroyed++;
                    
                    // 创建爆炸粒子
                    for (let i = 0; i < 10; i++) {
                        this.gameState.particles.push({
                            x: enemy.x + enemy.width / 2,
                            y: enemy.y + enemy.height / 2,
                            vx: Math.random() * 6 - 3,
                            vy: Math.random() * 6 - 3,
                            size: Math.random() * 4 + 2,
                            color: enemy.color,
                            life: 1.0
                        });
                    }
                    
                    this.gameState.bullets.splice(bulletIndex, 1);
                    this.gameState.enemies.splice(enemyIndex, 1);
                    this.recordEvent('enemy_destroyed', { score: this.gameState.score });
                    
                    // 创建新敌人
                    setTimeout(() => this.createEnemy(), 2000);
                }
            });
        });
        
        // 敌人子弹击中玩家
        this.gameState.enemyBullets.forEach((bullet, index) => {
            if (this.collision(bullet, player) && !player.invincible) {
                this.gameState.lives--;
                this.gameData.currentRoundData.livesLost++;
                this.gameState.enemyBullets.splice(index, 1);
                this.recordEvent('player_hit', { lives: this.gameState.lives });
                
                if (this.gameState.lives <= 0) {
                    this.endCurrentRound();
                } else {
                    player.invincible = true;
                    setTimeout(() => { player.invincible = false; }, 2000);
                }
            }
        });
        
        this.updateScoreDisplay();
    }

    collision(a, b) {
        return !(
            ((a.y + a.height) < b.y) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById('color-blast-score');
        const livesElement = document.getElementById('color-blast-lives');
        
        if (scoreElement) scoreElement.textContent = this.gameState.score;
        if (livesElement) livesElement.textContent = this.gameState.lives;
    }

    recordEvent(type, data = {}) {
        if (this.gameData.currentRoundData) {
            this.gameData.currentRoundData.events.push({
                timestamp: Date.now(),
                type: type,
                data: data
            });
        }
    }

    reportToTrainingSystem() {
        const report = {
            gameType: 'color_blast',
            currentRound: this.gameState.currentRound,
            roundData: this.gameData.currentRoundData,
            totalStats: {
                totalRounds: this.gameData.rounds.length,
                totalScore: this.gameData.totalScore,
                totalEnemiesDestroyed: this.gameData.totalEnemiesDestroyed,
                totalShotsFired: this.gameData.totalShotsFired,
                avgScore: this.calculateAverageScore(),
                accuracy: this.calculateAccuracy()
            },
            cognitiveMetrics: this.calculateCognitiveMetrics()
        };
        
        if (window.TrainingAPI) {
            TrainingAPI.reportGameData(report);
        }
    }

    calculateCognitiveMetrics() {
        if (this.gameData.rounds.length === 0) return null;
        
        const rounds = this.gameData.rounds;
        const scores = rounds.map(r => r.score);
        const durations = rounds.map(r => r.duration / 1000);
        const enemiesDestroyed = rounds.map(r => r.enemiesDestroyed);
        const shotsFired = rounds.map(r => r.shotsFired);
        
        const mean = arr => arr.reduce((sum, val) => sum + val, 0) / arr.length;
        
        return {
            // 反应速度和决策
            reactionDecision: {
                responseSpeed: {
                    avgReactionTime: this.calculateAvgReactionTime(durations, shotsFired),
                    decisionAccuracy: this.calculateDecisionAccuracy(enemiesDestroyed, shotsFired),
                    responseConsistency: this.calculateResponseConsistency(scores)
                },
                cognitiveLoad: {
                    multitaskingAbility: this.calculateMultitaskingAbility(scores, enemiesDestroyed),
                    performanceUnderPressure: this.calculatePerformanceUnderPressure(scores, rounds)
                }
            },
            
            // 注意力功能
            attention: {
                sustainedAttention: {
                    attentionSpan: mean(durations),
                    consistencyIndex: this.calculateConsistencyIndex(scores)
                },
                selectiveAttention: {
                    focusAccuracy: this.calculateFocusAccuracy(enemiesDestroyed, shotsFired),
                    errorRate: this.calculateErrorRate(rounds)
                }
            },
            
            // 执行功能
            executiveFunction: {
                planningAbility: {
                    strategicEfficiency: mean(scores.map((score, i) => score / durations[i]))
                },
                impulseControl: {
                    controlStability: this.calculateControlStability(shotsFired, enemiesDestroyed)
                }
            },
            
            // 元数据
            analysisMetadata: {
                totalRounds: rounds.length,
                analysisTimestamp: new Date().toISOString(),
                dataQuality: this.assessDataQuality(rounds)
            }
        };
    }

    calculateAverageScore() {
        return this.gameData.rounds.length > 0 ? 
            this.gameData.rounds.reduce((sum, r) => sum + r.score, 0) / this.gameData.rounds.length : 0;
    }

    calculateAccuracy() {
        return this.gameData.totalShotsFired > 0 ? 
            (this.gameData.totalEnemiesDestroyed / this.gameData.totalShotsFired) : 0;
    }

    calculateAvgReactionTime(durations, shotsFired) {
        const avgDuration = mean(durations);
        const avgShots = mean(shotsFired);
        return avgShots > 0 ? avgDuration / avgShots : 0;
    }

    calculateDecisionAccuracy(enemiesDestroyed, shotsFired) {
        const results = enemiesDestroyed.map((destroyed, i) => 
            destroyed / Math.max(1, shotsFired[i])
        );
        return mean(results);
    }

    calculateResponseConsistency(scores) {
        const std = arr => {
            const m = mean(arr);
            return Math.sqrt(arr.reduce((sum, val) => sum + (val - m) ** 2, 0) / arr.length);
        };
        return 1 - (std(scores) / Math.max(mean(scores), 1));
    }

    calculateMultitaskingAbility(scores, enemiesDestroyed) {
        const normalizedScores = this.normalizeArray(scores);
        const normalizedEnemies = this.normalizeArray(enemiesDestroyed);
        const multitaskingScores = normalizedScores.map((score, i) => 
            (score + normalizedEnemies[i]) / 2
        );
        return mean(multitaskingScores);
    }

    calculatePerformanceUnderPressure(scores, rounds) {
        const pressureRounds = rounds.filter(r => r.livesLost > 0);
        const normalRounds = rounds.filter(r => r.livesLost === 0);
        
        const pressureAvg = pressureRounds.length > 0 ? 
            mean(pressureRounds.map(r => r.score)) : 0;
        const normalAvg = normalRounds.length > 0 ? 
            mean(normalRounds.map(r => r.score)) : 0;
        
        return normalAvg > 0 ? pressureAvg / normalAvg : 1;
    }

    calculateConsistencyIndex(scores) {
        return this.calculateResponseConsistency(scores);
    }

    calculateFocusAccuracy(enemiesDestroyed, shotsFired) {
        return this.calculateDecisionAccuracy(enemiesDestroyed, shotsFired);
    }

    calculateErrorRate(rounds) {
        const avgLivesLost = mean(rounds.map(r => r.livesLost));
        return avgLivesLost / 3; // 假设最大生命值为3
    }

    calculateControlStability(shotsFired, enemiesDestroyed) {
        const efficiency = shotsFired.map((shots, i) => 
            enemiesDestroyed[i] / Math.max(1, shots)
        );
        return this.calculateResponseConsistency(efficiency);
    }

    normalizeArray(arr) {
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const range = max - min;
        return range > 0 ? arr.map(val => (val - min) / range) : arr.map(() => 0.5);
    }

    assessDataQuality(rounds) {
        const minRounds = 3;
        const qualityScore = Math.min(1, rounds.length / minRounds);
        
        let quality = "优秀";
        if (qualityScore < 0.3) quality = "较差";
        else if (qualityScore < 0.6) quality = "一般";
        else if (qualityScore < 0.8) quality = "良好";
        
        return {
            score: qualityScore,
            level: quality,
            recommendation: rounds.length < minRounds ? 
                `建议至少进行${minRounds}轮游戏以获得更可靠的认知评估` : 
                "数据质量良好，可进行可靠的认知功能分析"
        };
    }
}

// 辅助函数
function mean(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

// 初始化游戏
let colorBlastGame;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        colorBlastGame = new ColorBlastGame();
        console.log('Color Blast游戏已加载');
    });
} else {
    colorBlastGame = new ColorBlastGame();
    console.log('Color Blast游戏已加载');
} 
/**
 * 独立的Snake游戏系统 - 自管理游戏逻辑和数据记录
 */

class SnakeGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameConfig = {
            width: 400,
            height: 400,
            cells: 20,
            cellSize: 20
        };
        
        this.gameState = {
            isRunning: false,
            isPaused: false,
            currentRound: 0,
            score: 0,
            snake: null,
            food: null,
            direction: { x: 0, y: 0 },
            requestID: null
        };
        
        this.gameData = {
            rounds: [],
            currentRoundData: null,
            totalScore: 0,
            totalDirectionChanges: 0,
            avgScore: 0
        };
        
        // 美观效果
        this.particles = [];
        this.splashingParticleCount = 20;
        this.currentHue = '';
        
        // 性能优化：帧率控制
        this.lastFrameTime = 0;
        this.frameRate = 1000 / 8; // 8 FPS
        
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        // 创建画布
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.gameConfig.width;
        this.canvas.height = this.gameConfig.height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        
        // 替换现有画布
        const canvasContainer = document.querySelector("#canvas");
        canvasContainer.innerHTML = '';
        canvasContainer.appendChild(this.canvas);
        
        // 初始化游戏对象
        this.resetGame();
        this.showWaitingState();
        
        // 监听训练系统事件
        window.addEventListener('trainingSystemEvent', (event) => {
            this.handleTrainingEvent(event.detail);
        });
    }

    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // 重启按钮
        const replayBtn = document.querySelector('#replay');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                this.restartCurrentRound();
            });
        }
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
        this.drawGrid();
        this.ctx.fillStyle = "#4cffd7";
        this.ctx.textAlign = "center";
        this.ctx.font = "bold 20px Poppins, sans-serif";
        this.ctx.fillText("SNAKE GAME", this.gameConfig.width / 2, this.gameConfig.height / 2 - 20);
        this.ctx.font = "14px Poppins, sans-serif";
        this.ctx.fillText("等待训练开始...", this.gameConfig.width / 2, this.gameConfig.height / 2 + 20);
    }

    startFirstRound() {
        this.startNewRound();
    }

    pauseGame() {
        if (this.gameState.isRunning) {
            this.gameState.isPaused = true;
            this.gameState.isRunning = false;
            if (this.gameState.requestID) {
                cancelAnimationFrame(this.gameState.requestID);
                this.gameState.requestID = null;
            }
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

    showPausedMessage() {
        this.clear();
        this.drawGrid();
        this.ctx.fillStyle = "#f39c12";
        this.ctx.textAlign = "center";
        this.ctx.font = "bold 24px Poppins, sans-serif";
        this.ctx.fillText("游戏已暂停", this.gameConfig.width / 2, this.gameConfig.height / 2);
        this.ctx.font = "16px Poppins, sans-serif";
        this.ctx.fillText("点击继续按钮恢复游戏", this.gameConfig.width / 2, this.gameConfig.height / 2 + 30);
    }

    startNewRound() {
        this.gameState.currentRound++;
        this.gameState.score = 0;
        this.gameState.isRunning = true;
        this.gameState.isPaused = false;
        
        // 记录当前轮数据 - 简化版
        this.gameData.currentRoundData = {
            roundNumber: this.gameState.currentRound,
            startTime: Date.now(),
            endTime: null,
            duration: 0,
            score: 0,
            events: [], // 只记录关键事件：转弯、得分、碰撞
            snakeLength: 1,
            foodEaten: 0,
            directionChanges: 0 // 转弯次数
        };
        
        this.resetGame();
        this.updateScoreDisplay();
        this.gameLoop();
        
        this.recordEvent('round_started');
        console.log(`Snake第${this.gameState.currentRound}轮开始`);
    }

    endCurrentRound() {
        if (!this.gameData.currentRoundData) return;
        
        this.gameState.isRunning = false;
        this.gameData.currentRoundData.endTime = Date.now();
        this.gameData.currentRoundData.duration = this.gameData.currentRoundData.endTime - this.gameData.currentRoundData.startTime;
        this.gameData.currentRoundData.score = this.gameState.score;
        
        // 保存轮次数据
        this.gameData.rounds.push({...this.gameData.currentRoundData});
        
        // 更新统计
        this.gameData.totalScore += this.gameState.score;
        this.gameData.avgScore = this.gameData.totalScore / this.gameData.rounds.length;
        
        this.recordEvent('round_ended');
        this.showRoundOverMessage();
        
        // 报告给训练系统
        this.reportToTrainingSystem();
        
        console.log(`Snake第${this.gameState.currentRound}轮结束，得分：${this.gameState.score}`);
    }

    restartCurrentRound() {
        if (window.TrainingAPI && TrainingAPI.getTrainingStatus() === 'training') {
            this.startNewRound();
        }
    }

    endAllRounds() {
        // 如果当前有正在进行的轮次，先结束它
        if (this.gameState.isRunning && this.gameData.currentRoundData) {
            this.gameState.isRunning = false;
            this.gameData.currentRoundData.endTime = Date.now();
            this.gameData.currentRoundData.duration = this.gameData.currentRoundData.endTime - this.gameData.currentRoundData.startTime;
            this.gameData.currentRoundData.score = this.gameState.score;
            
            // 保存当前轮次数据
            this.gameData.rounds.push({...this.gameData.currentRoundData});
            
            // 更新统计
            this.gameData.totalScore += this.gameState.score;
            this.gameData.avgScore = this.gameData.totalScore / this.gameData.rounds.length;
            
            this.recordEvent('training_ended_mid_round');
            
            // 报告给训练系统
            this.reportToTrainingSystem();
            
            console.log(`训练结束，第${this.gameState.currentRound}轮已记录（未完成轮次），得分：${this.gameState.score}`);
        }
        
        this.gameState.isRunning = false;
        this.clear();
        this.ctx.fillStyle = "#e74c3c";
        this.ctx.textAlign = "center";
        this.ctx.font = "bold 24px Poppins, sans-serif";
        this.ctx.fillText("训练结束", this.gameConfig.width / 2, this.gameConfig.height / 2);
        this.ctx.font = "16px Poppins, sans-serif";
        this.ctx.fillText("查看控制台获取详细结果", this.gameConfig.width / 2, this.gameConfig.height / 2 + 30);
    }

    showRoundOverMessage() {
        this.clear();
        this.ctx.fillStyle = "#4cffd7";
        this.ctx.textAlign = "center";
        this.ctx.font = "bold 24px Poppins, sans-serif";
        this.ctx.fillText("ROUND OVER", this.gameConfig.width / 2, this.gameConfig.height / 2 - 40);
        this.ctx.font = "16px Poppins, sans-serif";
        this.ctx.fillText(`得分: ${this.gameState.score}`, this.gameConfig.width / 2, this.gameConfig.height / 2 - 10);
        this.ctx.fillText(`轮次: ${this.gameState.currentRound}`, this.gameConfig.width / 2, this.gameConfig.height / 2 + 20);
        this.ctx.fillText("按空格键或点击RESTART开始新一轮", this.gameConfig.width / 2, this.gameConfig.height / 2 + 50);
    }

    handleKeyDown(event) {
        // 阻止方向键滚动页面
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
        
        // 只记录关键按键事件，不记录每次按键
        if (event.code === 'Space' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            if (!this.gameState.isRunning && !this.gameState.isPaused && window.TrainingAPI && TrainingAPI.getTrainingStatus() === 'training') {
                this.startNewRound();
            }
            return;
        }
        
        // 游戏未运行或暂停时不处理方向键
        if (!this.gameState.isRunning || this.gameState.isPaused) return;
        
        // 处理方向键 - 只在实际改变方向时记录
        const newDirection = this.getDirectionFromKey(event.key);
        if (newDirection && this.isValidDirection(newDirection)) {
            // 只在方向真正改变时记录转弯事件
            if (this.gameState.direction.x !== newDirection.x || this.gameState.direction.y !== newDirection.y) {
                this.recordDirectionChange();
                this.recordEvent('direction_change', { 
                    from: {...this.gameState.direction}, 
                    to: {...newDirection} 
                });
            }
            this.gameState.direction = newDirection;
        }
    }

    getDirectionFromKey(key) {
        const directions = {
            'ArrowUp': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 }
        };
        return directions[key] || null;
    }

    isValidDirection(newDirection) {
        const currentDir = this.gameState.direction;
        // 防止反向移动
        return !(newDirection.x === -currentDir.x && newDirection.y === -currentDir.y);
    }

    resetGame() {
        this.gameState.snake = [{ x: 200, y: 200 }];
        this.gameState.direction = { x: 0, y: 0 };
        this.spawnFood();
        this.particles = [];
    }

    spawnFood() {
        const cellSize = this.gameConfig.cellSize;
        let newPos;
        
        do {
            newPos = {
                x: Math.floor(Math.random() * this.gameConfig.cells) * cellSize,
                y: Math.floor(Math.random() * this.gameConfig.cells) * cellSize
            };
        } while (this.gameState.snake.some(segment => segment.x === newPos.x && segment.y === newPos.y));
        
        this.gameState.food = newPos;
        this.currentHue = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
    }

    gameLoop(currentTime = 0) {
        if (!this.gameState.isRunning) return;
        
        // 帧率控制
        if (currentTime - this.lastFrameTime >= this.frameRate) {
            this.clear();
            this.drawGrid();
            this.updateSnake();
            this.drawSnake();
            this.drawFood();
            this.updateParticles();
            this.garbageCollectParticles();
            
            this.lastFrameTime = currentTime;
        }
        
        this.gameState.requestID = requestAnimationFrame((time) => this.gameLoop(time));
    }

    updateSnake() {
        if (this.gameState.direction.x === 0 && this.gameState.direction.y === 0) return;
        
        const head = { ...this.gameState.snake[0] };
        head.x += this.gameState.direction.x * this.gameConfig.cellSize;
        head.y += this.gameState.direction.y * this.gameConfig.cellSize;
        
        // 边界处理
        if (head.x < 0) head.x = this.gameConfig.width - this.gameConfig.cellSize;
        if (head.x >= this.gameConfig.width) head.x = 0;
        if (head.y < 0) head.y = this.gameConfig.height - this.gameConfig.cellSize;
        if (head.y >= this.gameConfig.height) head.y = 0;
        
        this.gameState.snake.unshift(head);
        
        // 检查食物碰撞
        if (head.x === this.gameState.food.x && head.y === this.gameState.food.y) {
            this.eatFood();
        } else {
            this.gameState.snake.pop();
        }
        
        // 检查自身碰撞
        if (this.checkSelfCollision()) {
            this.recordEvent('snake_collision');
            this.endCurrentRound();
        }
    }

    eatFood() {
        this.gameState.score++;
        this.gameData.currentRoundData.foodEaten++;
        this.gameData.currentRoundData.snakeLength = this.gameState.snake.length;
        
        this.updateScoreDisplay();
        this.createParticles();
        this.spawnFood();
        
        this.recordEvent('food_eaten', { 
            score: this.gameState.score,
            snakeLength: this.gameState.snake.length 
        });
    }

    checkSelfCollision() {
        const head = this.gameState.snake[0];
        return this.gameState.snake.slice(1).some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }

    clear() {
        this.ctx.clearRect(0, 0, this.gameConfig.width, this.gameConfig.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = "#232332";
        this.ctx.lineWidth = 1;
        
        for (let i = 1; i < this.gameConfig.cells; i++) {
            const pos = (this.gameConfig.width / this.gameConfig.cells) * i;
            
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.gameConfig.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.gameConfig.width, pos);
            this.ctx.stroke();
        }
    }

    drawSnake() {
        this.ctx.fillStyle = "white";
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = "rgba(255,255,255,0.3)";
        
        this.gameState.snake.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.fillStyle = "white";
            } else {
                this.ctx.fillStyle = "rgba(225,225,225,1)";
            }
            this.ctx.fillRect(segment.x, segment.y, this.gameConfig.cellSize, this.gameConfig.cellSize);
        });
        
        this.ctx.shadowBlur = 0;
    }

    drawFood() {
        this.ctx.fillStyle = this.currentHue;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = this.currentHue;
        this.ctx.fillRect(this.gameState.food.x, this.gameState.food.y, this.gameConfig.cellSize, this.gameConfig.cellSize);
        this.ctx.shadowBlur = 0;
    }

    createParticles() {
        for (let i = 0; i < this.splashingParticleCount; i++) {
            const vel = {
                x: Math.random() * 6 - 3,
                y: Math.random() * 6 - 3
            };
            this.particles.push({
                x: this.gameState.food.x,
                y: this.gameState.food.y,
                vx: vel.x,
                vy: vel.y,
                size: Math.random() * 4 + 2,
                color: this.currentHue,
                life: 1.0
            });
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // 重力
            particle.life -= 0.02;
            particle.size *= 0.95;
            
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            this.ctx.globalAlpha = 1;
        });
    }

    garbageCollectParticles() {
        this.particles = this.particles.filter(particle => particle.life > 0);
    }

    updateScoreDisplay() {
        const scoreElement = document.querySelector('#score');
        if (scoreElement) {
            scoreElement.textContent = this.gameState.score.toString().padStart(2, '0');
        }
    }

    recordDirectionChange() {
        if (this.gameData.currentRoundData) {
            this.gameData.currentRoundData.directionChanges++;
            this.gameData.totalDirectionChanges++;
        }
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
            gameType: 'snake',
            currentRound: this.gameState.currentRound,
            roundData: this.gameData.currentRoundData,
            totalStats: {
                totalRounds: this.gameData.rounds.length,
                totalScore: this.gameData.totalScore,
                avgScore: Math.round(this.gameData.avgScore * 100) / 100,
                totalDirectionChanges: this.gameData.totalDirectionChanges,
                avgDirectionChangesPerRound: Math.round((this.gameData.totalDirectionChanges / this.gameData.rounds.length) * 100) / 100
            },
            // 新增：认知功能评估指标
            cognitiveMetrics: this.calculateCognitiveMetrics()
        };
        
        if (window.TrainingAPI) {
            TrainingAPI.reportGameData(report);
        }
    }

    calculateCognitiveMetrics() {
        if (this.gameData.rounds.length === 0) {
            return null;
        }

        const rounds = this.gameData.rounds;
        const scores = rounds.map(r => r.score);
        const durations = rounds.map(r => r.duration / 1000); // 转换为秒
        const directionChanges = rounds.map(r => r.directionChanges);
        const snakeLengths = rounds.map(r => r.snakeLength);

        // 1. 执行功能指标 (Executive Function)
        const executiveFunction = {
            // 计划能力：基于平均蛇长度和得分效率
            planningAbility: {
                avgSnakeLength: this.calculateMean(snakeLengths),
                scoreEfficiency: this.calculateMean(scores.map((score, i) => score / durations[i])), // 每秒得分
                maxSnakeLength: Math.max(...snakeLengths),
                planningScore: this.calculatePlanningScore(scores, snakeLengths)
            },
            // 认知灵活性：基于转向适应性
            cognitiveFlexibility: {
                avgDirectionChanges: this.calculateMean(directionChanges),
                turningEfficiency: this.calculateMean(scores.map((score, i) => score / Math.max(1, directionChanges[i]))), // 转向效率
                adaptabilityIndex: this.calculateAdaptabilityIndex(scores, directionChanges)
            },
            // 冲动控制：基于转向频率合理性
            impulseControl: {
                overTurningRatio: this.calculateOverTurningRatio(scores, directionChanges),
                controlStability: this.calculateControlStability(directionChanges)
            }
        };

        // 2. 注意力指标 (Attention)
        const attention = {
            // 持续注意力：基于游戏时长稳定性
            sustainedAttention: {
                avgRoundDuration: this.calculateMean(durations),
                durationStability: this.calculateStabilityIndex(durations),
                longestRound: Math.max(...durations),
                attentionMaintenance: this.calculateAttentionMaintenance(scores, durations)
            },
            // 注意力分配：基于错误和表现的关系
            attentionAllocation: {
                errorRate: this.calculateErrorRate(rounds),
                recoveryRate: this.calculateRecoveryRate(scores),
                consistencyIndex: this.calculateConsistencyIndex(scores)
            }
        };

        // 3. 学习能力指标 (Learning)
        const learning = {
            // 学习曲线
            learningCurve: {
                improvementTrend: this.calculateImprovementTrend(scores),
                learningRate: this.calculateLearningRate(scores),
                plateauReached: this.checkPlateauReached(scores),
                adaptationSpeed: this.calculateAdaptationSpeed(scores)
            },
            // 技能迁移
            skillTransfer: {
                crossRoundImprovement: this.calculateCrossRoundImprovement(scores),
                strategyConsistency: this.calculateStrategyConsistency(directionChanges, scores)
            }
        };

        // 4. 反应速度和决策指标 (Reaction Time & Decision Making)
        const reactionDecision = {
            // 决策效率
            decisionEfficiency: {
                avgDecisionTime: this.calculateAvgDecisionTime(durations, directionChanges),
                decisionAccuracy: this.calculateDecisionAccuracy(scores, directionChanges),
                responseSpeed: this.calculateResponseSpeed(scores, durations)
            },
            // 认知负荷处理
            cognitiveLoad: {
                complexityHandling: this.calculateComplexityHandling(scores, snakeLengths),
                performanceUnderPressure: this.calculatePerformanceUnderPressure(scores, snakeLengths),
                multitaskingAbility: this.calculateMultitaskingAbility(scores, directionChanges, durations)
            }
        };

        // 5. 空间认知指标 (Spatial Cognition)
        const spatialCognition = {
            // 空间规划
            spatialPlanning: {
                spaceUtilization: this.calculateSpaceUtilization(snakeLengths),
                navigationEfficiency: this.calculateNavigationEfficiency(scores, directionChanges),
                spatialMemory: this.calculateSpatialMemory(scores, durations)
            }
        };

        // 6. 综合认知评估 (Overall Cognitive Assessment)
        const overallAssessment = {
            cognitiveFlexibilityScore: this.calculateCognitiveFlexibilityScore(executiveFunction, attention),
            executiveFunctionScore: this.calculateExecutiveFunctionScore(executiveFunction),
            learningEfficiencyScore: this.calculateLearningEfficiencyScore(learning),
            attentionQualityScore: this.calculateAttentionQualityScore(attention),
            overallCognitiveIndex: 0 // 将在最后计算
        };

        // 计算总体认知指数
        overallAssessment.overallCognitiveIndex = this.calculateOverallCognitiveIndex(overallAssessment);

        return {
            executiveFunction,
            attention,
            learning,
            reactionDecision,
            spatialCognition,
            overallAssessment,
            // 元数据
            analysisMetadata: {
                totalRounds: rounds.length,
                analysisTimestamp: new Date().toISOString(),
                dataQuality: this.assessDataQuality(rounds)
            }
        };
    }

    // 辅助计算方法
    calculateMean(arr) {
        return arr.length > 0 ? Math.round((arr.reduce((sum, val) => sum + val, 0) / arr.length) * 100) / 100 : 0;
    }

    calculateStandardDeviation(arr) {
        const mean = this.calculateMean(arr);
        const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.round(Math.sqrt(variance) * 100) / 100;
    }

    calculateStabilityIndex(arr) {
        if (arr.length < 2) return 1;
        const std = this.calculateStandardDeviation(arr);
        const mean = this.calculateMean(arr);
        return Math.round((1 - (std / (mean || 1))) * 100) / 100;
    }

    calculatePlanningScore(scores, snakeLengths) {
        // 规划能力 = 平均得分 * 蛇长度稳定性
        const avgScore = this.calculateMean(scores);
        const lengthStability = this.calculateStabilityIndex(snakeLengths);
        return Math.round((avgScore * lengthStability) * 100) / 100;
    }

    calculateAdaptabilityIndex(scores, directionChanges) {
        // 适应性指数 = 得分与转向次数的相关性
        if (scores.length < 2) return 0;
        const scoreImprovement = scores[scores.length - 1] - scores[0];
        const turningOptimization = directionChanges[0] - directionChanges[directionChanges.length - 1];
        return Math.round(((scoreImprovement + turningOptimization) / 2) * 100) / 100;
    }

    calculateOverTurningRatio(scores, directionChanges) {
        // 过度转向比率：转向次数相对于得分的比例
        const avgScore = this.calculateMean(scores);
        const avgTurning = this.calculateMean(directionChanges);
        return avgScore > 0 ? Math.round((avgTurning / avgScore) * 100) / 100 : 0;
    }

    calculateControlStability(directionChanges) {
        return this.calculateStabilityIndex(directionChanges);
    }

    calculateAttentionMaintenance(scores, durations) {
        // 注意力维持 = 长时间游戏的得分维持率
        if (scores.length < 2) return 1;
        const longRounds = scores.filter((_, i) => durations[i] > this.calculateMean(durations));
        const shortRounds = scores.filter((_, i) => durations[i] <= this.calculateMean(durations));
        const longAvg = this.calculateMean(longRounds);
        const shortAvg = this.calculateMean(shortRounds);
        return shortAvg > 0 ? Math.round((longAvg / shortAvg) * 100) / 100 : 1;
    }

    calculateErrorRate(rounds) {
        // 错误率：基于低分轮次的比例
        const avgScore = this.calculateMean(rounds.map(r => r.score));
        const lowScoreRounds = rounds.filter(r => r.score < avgScore * 0.5).length;
        return Math.round((lowScoreRounds / rounds.length) * 100) / 100;
    }

    calculateRecoveryRate(scores) {
        // 恢复率：低分后的反弹能力
        let recoveries = 0;
        let lowPerformances = 0;
        const avgScore = this.calculateMean(scores);
        
        for (let i = 0; i < scores.length - 1; i++) {
            if (scores[i] < avgScore * 0.7) {
                lowPerformances++;
                if (scores[i + 1] > scores[i]) {
                    recoveries++;
                }
            }
        }
        return lowPerformances > 0 ? Math.round((recoveries / lowPerformances) * 100) / 100 : 1;
    }

    calculateConsistencyIndex(scores) {
        return this.calculateStabilityIndex(scores);
    }

    calculateImprovementTrend(scores) {
        if (scores.length < 2) return 0;
        let improvements = 0;
        for (let i = 1; i < scores.length; i++) {
            if (scores[i] > scores[i - 1]) improvements++;
        }
        return Math.round((improvements / (scores.length - 1)) * 100) / 100;
    }

    calculateLearningRate(scores) {
        if (scores.length < 2) return 0;
        const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
        const secondHalf = scores.slice(Math.floor(scores.length / 2));
        const firstAvg = this.calculateMean(firstHalf);
        const secondAvg = this.calculateMean(secondHalf);
        return firstAvg > 0 ? Math.round(((secondAvg - firstAvg) / firstAvg) * 100) / 100 : 0;
    }

    checkPlateauReached(scores) {
        if (scores.length < 4) return false;
        const lastQuarter = scores.slice(-Math.floor(scores.length / 4));
        const stability = this.calculateStabilityIndex(lastQuarter);
        return stability > 0.8; // 高稳定性表示达到平台期
    }

    calculateAdaptationSpeed(scores) {
        // 适应速度：达到个人最佳表现的轮次
        const maxScore = Math.max(...scores);
        const maxIndex = scores.indexOf(maxScore);
        return maxIndex + 1;
    }

    calculateCrossRoundImprovement(scores) {
        return this.calculateLearningRate(scores);
    }

    calculateStrategyConsistency(directionChanges, scores) {
        // 策略一致性：高分轮次的转向模式相似性
        const highScoreThreshold = this.calculateMean(scores) * 1.2;
        const highScoreRounds = directionChanges.filter((_, i) => scores[i] >= highScoreThreshold);
        return this.calculateStabilityIndex(highScoreRounds);
    }

    calculateAvgDecisionTime(durations, directionChanges) {
        // 平均决策时间 = 游戏时长 / 决策次数
        const avgDuration = this.calculateMean(durations);
        const avgDecisions = this.calculateMean(directionChanges);
        return avgDecisions > 0 ? Math.round((avgDuration / avgDecisions) * 100) / 100 : 0;
    }

    calculateDecisionAccuracy(scores, directionChanges) {
        // 决策准确性 = 得分 / 决策次数
        const results = scores.map((score, i) => score / Math.max(1, directionChanges[i]));
        return this.calculateMean(results);
    }

    calculateResponseSpeed(scores, durations) {
        // 反应速度 = 得分 / 时间
        const results = scores.map((score, i) => score / Math.max(1, durations[i]));
        return this.calculateMean(results);
    }

    calculateComplexityHandling(scores, snakeLengths) {
        // 复杂度处理：长蛇时的表现维持
        const complexRounds = scores.filter((_, i) => snakeLengths[i] > this.calculateMean(snakeLengths));
        const simpleRounds = scores.filter((_, i) => snakeLengths[i] <= this.calculateMean(snakeLengths));
        const complexAvg = this.calculateMean(complexRounds);
        const simpleAvg = this.calculateMean(simpleRounds);
        return simpleAvg > 0 ? Math.round((complexAvg / simpleAvg) * 100) / 100 : 1;
    }

    calculatePerformanceUnderPressure(scores, snakeLengths) {
        // 压力下的表现：蛇长度与得分的关系
        const correlation = this.calculateCorrelation(snakeLengths, scores);
        return Math.round(correlation * 100) / 100;
    }

    calculateMultitaskingAbility(scores, directionChanges, durations) {
        // 多任务能力：在保持高得分的同时维持合理的转向和时间
        const normalizedScores = this.normalizeArray(scores);
        const normalizedTurning = this.normalizeArray(directionChanges.map(x => 1/Math.max(1, x))); // 转向越少越好
        const normalizedDuration = this.normalizeArray(durations);
        
        const multitaskingScores = normalizedScores.map((score, i) => 
            (score + normalizedTurning[i] + normalizedDuration[i]) / 3
        );
        return this.calculateMean(multitaskingScores);
    }

    calculateSpaceUtilization(snakeLengths) {
        // 空间利用率：相对于最大可能长度的比例
        const maxPossibleLength = this.gameConfig.cells * this.gameConfig.cells - 1; // 理论最大长度
        const avgLength = this.calculateMean(snakeLengths);
        return Math.round((avgLength / maxPossibleLength) * 100) / 100;
    }

    calculateNavigationEfficiency(scores, directionChanges) {
        // 导航效率：单位转向的得分
        return this.calculateMean(scores.map((score, i) => score / Math.max(1, directionChanges[i])));
    }

    calculateSpatialMemory(scores, durations) {
        // 空间记忆：长期游戏的表现稳定性
        return this.calculateStabilityIndex(scores);
    }

    // 综合评分计算
    calculateCognitiveFlexibilityScore(executiveFunction, attention) {
        const flexibility = executiveFunction.cognitiveFlexibility.adaptabilityIndex;
        const consistency = attention.attentionAllocation.consistencyIndex;
        return Math.round(((flexibility + consistency) / 2) * 100) / 100;
    }

    calculateExecutiveFunctionScore(executiveFunction) {
        const planning = Math.min(1, executiveFunction.planningAbility.planningScore / 10);
        const flexibility = Math.min(1, executiveFunction.cognitiveFlexibility.adaptabilityIndex);
        const control = Math.min(1, executiveFunction.impulseControl.controlStability);
        return Math.round(((planning + flexibility + control) / 3) * 100) / 100;
    }

    calculateLearningEfficiencyScore(learning) {
        const improvement = learning.learningCurve.improvementTrend;
        const learningRate = Math.min(1, Math.abs(learning.learningCurve.learningRate));
        const adaptation = Math.min(1, 1 / Math.max(1, learning.learningCurve.adaptationSpeed / 5));
        return Math.round(((improvement + learningRate + adaptation) / 3) * 100) / 100;
    }

    calculateAttentionQualityScore(attention) {
        const sustained = Math.min(1, attention.sustainedAttention.attentionMaintenance);
        const allocation = Math.max(0, 1 - attention.attentionAllocation.errorRate);
        const consistency = attention.attentionAllocation.consistencyIndex;
        return Math.round(((sustained + allocation + consistency) / 3) * 100) / 100;
    }

    calculateOverallCognitiveIndex(overallAssessment) {
        const scores = [
            overallAssessment.cognitiveFlexibilityScore,
            overallAssessment.executiveFunctionScore,
            overallAssessment.learningEfficiencyScore,
            overallAssessment.attentionQualityScore
        ];
        return this.calculateMean(scores);
    }

    // 辅助方法
    calculateCorrelation(arr1, arr2) {
        if (arr1.length !== arr2.length || arr1.length < 2) return 0;
        
        const mean1 = this.calculateMean(arr1);
        const mean2 = this.calculateMean(arr2);
        
        let numerator = 0;
        let sum1Sq = 0;
        let sum2Sq = 0;
        
        for (let i = 0; i < arr1.length; i++) {
            const diff1 = arr1[i] - mean1;
            const diff2 = arr2[i] - mean2;
            numerator += diff1 * diff2;
            sum1Sq += diff1 * diff1;
            sum2Sq += diff2 * diff2;
        }
        
        const denominator = Math.sqrt(sum1Sq * sum2Sq);
        return denominator !== 0 ? numerator / denominator : 0;
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
            score: Math.round(qualityScore * 100) / 100,
            level: quality,
            recommendation: rounds.length < minRounds ? 
                `建议至少进行${minRounds}轮游戏以获得更可靠的认知评估` : 
                "数据质量良好，可进行可靠的认知功能分析"
        };
    }
}

// 初始化游戏
let snakeGame;

// 等待DOM加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        snakeGame = new SnakeGame();
        console.log('独立Snake游戏系统已加载');
    });
} else {
    snakeGame = new SnakeGame();
    console.log('独立Snake游戏系统已加载');
} 
/**
 * 通用训练系统 - 只负责计时和数据收集
 */

class TrainingSystem {
    constructor() {
        this.trainingData = {
            startTime: null,
            endTime: null,
            status: 'ready', // ready, training, paused, ended
            totalDuration: 0,
            gameReports: [] // 存储各种游戏的报告
        };
        
        this.timer = {
            startTime: null,
            pausedTime: 0,
            interval: null,
            current: 0
        };
        
        this.elements = this.initializeElements();
        this.bindEvents();
        this.threeMinuteTimer = null;
        this.createInstructionOverlay();
    }

    initializeElements() {
        return {
            pauseBtn: document.getElementById('pause-btn'),
            endBtn: document.getElementById('end-btn'),
            backBtn: document.getElementById('back-btn'),
            timer: document.getElementById('timer'),
            timerCopy: document.getElementById('timer-copy'),
            trainingStatus: document.getElementById('game-status')
        };
    }

    bindEvents() {
        this.elements.pauseBtn.addEventListener('click', () => this.handleMainButton());
        this.elements.endBtn.addEventListener('click', () => this.confirmEndTraining());
        this.elements.backBtn.addEventListener('click', () => this.handleBack());
        
        // 页面关闭前输出结果
        window.addEventListener('beforeunload', () => this.outputResults());
    }

    createInstructionOverlay() {
        const gameTitle = document.getElementById('game-title').textContent;
        
        const overlay = document.createElement('div');
        overlay.id = 'instruction-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        modal.innerHTML = `
            <h2 style="color: #2c3e50; margin-bottom: 1rem;">
                <i class="fas fa-gamepad"></i> 欢迎来到${gameTitle}！
            </h2>
            <div style="text-align: left; margin: 1.5rem 0; color: #555; line-height: 1.6;">
                <p><strong>🎮 游戏说明：</strong></p>
                <ul style="margin-left: 1rem;">
                    <li>使用方向键控制蛇的移动</li>
                    <li>吃到食物得分，避免撞到自己</li>
                    <li>支持多轮游戏模式</li>
                    <li>蛇碰撞后按空格键或点击RESTART开始新一轮</li>
                </ul>
                <p><strong>🎯 训练目的：</strong>提高反应速度和手眼协调能力</p>
                <p><strong>⏱️ 训练说明：</strong></p>
                <ul style="margin-left: 1rem;">
                    <li>建议训练时长至少3分钟</li>
                    <li>系统会在3分钟时提醒您</li>
                    <li>训练过程中请保持专注</li>
                    <li>训练结束后将显示详细的游戏数据</li>
                </ul>
            </div>
            <button id="start-training-btn" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-play"></i> 开始训练
            </button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 绑定开始训练按钮事件
        document.getElementById('start-training-btn').addEventListener('click', () => {
            this.hideInstructionOverlay();
            setTimeout(() => {
                this.startTraining();
            }, 300);
        });
    }

    showInstructionOverlay() {
        const overlay = document.getElementById('instruction-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideInstructionOverlay() {
        const overlay = document.getElementById('instruction-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    handleMainButton() {
        if (this.trainingData.status === 'ready') {
            this.showInstructionOverlay();
        } else if (this.trainingData.status === 'training') {
            this.pauseTraining();
        } else if (this.trainingData.status === 'paused') {
            this.resumeTraining();
        }
    }

    startTraining() {
        if (this.trainingData.status !== 'ready') return;
        
        this.trainingData.status = 'training';
        this.trainingData.startTime = new Date();
        this.startTimer();
        this.start3MinuteTimer();
        
        this.elements.trainingStatus.textContent = '训练中';
        this.elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
        this.elements.endBtn.disabled = false;
        
        this.notifyGame('training_start');
        console.log('训练开始');
    }

    pauseTraining() {
        this.trainingData.status = 'paused';
        this.pauseTimer();
        this.stop3MinuteTimer();
        
        this.elements.trainingStatus.textContent = '已暂停';
        this.elements.pauseBtn.innerHTML = '<i class="fas fa-play"></i> 继续';
        
        this.notifyGame('training_pause');
        console.log('训练暂停');
    }

    resumeTraining() {
        this.trainingData.status = 'training';
        this.resumeTimer();
        this.start3MinuteTimer();
        
        this.elements.trainingStatus.textContent = '训练中';
        this.elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
        
        this.notifyGame('training_resume');
        console.log('训练继续');
    }

    confirmEndTraining() {
        const currentDuration = this.timer.current;
        const minutes = Math.floor(currentDuration / 60000);
        const seconds = Math.floor((currentDuration % 60000) / 1000);
        const timeText = `${minutes}分${seconds}秒`;
        
        let message;
        if (currentDuration < 3 * 60 * 1000) {
            message = `您的当前训练时长为${timeText}。\n\n建议训练时长至少3分钟以获得更好的训练效果。\n\n确定要结束训练吗？`;
        } else {
            message = `您的训练时长为${timeText}，已达到建议时长。\n\n确定要结束训练吗？`;
        }
        
        if (confirm(message)) {
            this.endTraining();
        }
    }

    endTraining() {
        if (this.trainingData.status === 'ended') return;
        
        // 先通知游戏结束当前轮次（如果正在进行中）
        this.notifyGame('training_end');
        
        this.trainingData.status = 'ended';
        this.trainingData.endTime = new Date();
        this.trainingData.totalDuration = this.trainingData.endTime - this.trainingData.startTime;
        this.stopTimer();
        this.stop3MinuteTimer();
        
        this.elements.trainingStatus.textContent = '已结束';
        this.elements.pauseBtn.disabled = true;
        this.elements.endBtn.disabled = true;
        
        // 延迟显示结果，确保游戏有时间处理结束事件
        setTimeout(() => {
            this.showResultsPage();
        }, 100);
        
        console.log('训练结束');
    }

    showResultsPage() {
        // 计算统计数据
        const stats = this.calculateStats();
        
        // 输出控制台完整结果
        this.outputResults();
        
        // 创建结果页面
        const resultsOverlay = document.createElement('div');
        resultsOverlay.id = 'results-overlay';
        resultsOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            overflow-y: auto;
        `;

        const resultsModal = document.createElement('div');
        resultsModal.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;



        resultsModal.innerHTML = `
            <h2 style="color: #2c3e50; margin-bottom: 1.5rem;">
                <i class="fas fa-gamepad"></i> 训练完成！
            </h2>
            
            <h3 style="color: #2c3e50; margin: 1.5rem 0 1rem 0; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem;">
                📊 游戏统计
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <h4 style="color: #3498db; margin-bottom: 0.5rem;">训练时长</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #2c3e50;">${stats.duration}</p>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <h4 style="color: #e74c3c; margin-bottom: 0.5rem;">完成轮数</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #2c3e50;">${stats.totalRounds}</p>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <h4 style="color: #27ae60; margin-bottom: 0.5rem;">最高得分</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #2c3e50;">${stats.maxScore}</p>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <h4 style="color: #f39c12; margin-bottom: 0.5rem;">平均得分</h4>
                    <p style="font-size: 1.5rem; font-weight: bold; color: #2c3e50;">${stats.avgScore}</p>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h4 style="color: #9b59b6; margin-bottom: 0.5rem;">平均轮次时长</h4>
                <p style="font-size: 1.5rem; font-weight: bold; color: #2c3e50;">${stats.avgRoundDuration}</p>
            </div>
            
            <button id="back-to-menu-btn" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 1rem;
            ">
                <i class="fas fa-home"></i> 返回菜单
            </button>
        `;

        resultsOverlay.appendChild(resultsModal);
        document.body.appendChild(resultsOverlay);

        // 绑定返回按钮事件
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    calculateStats() {
        const reports = this.trainingData.gameReports;
        let totalRounds = 0;
        let maxScore = 0;
        let allScores = [];
        let totalDuration = 0;

        reports.forEach(report => {
            if (report.report.totalStats) {
                totalRounds = Math.max(totalRounds, report.report.totalStats.totalRounds);
                maxScore = Math.max(maxScore, report.report.roundData.score);
                allScores.push(report.report.roundData.score);
                if (report.report.roundData.duration) {
                    totalDuration += report.report.roundData.duration;
                }
            }
        });

        const avgScore = allScores.length > 0 ? Math.round((allScores.reduce((sum, score) => sum + score, 0) / allScores.length) * 100) / 100 : 0;
        const avgRoundDuration = totalRounds > 0 ? Math.round((totalDuration / totalRounds / 1000) * 100) / 100 : 0;
        const avgRoundDurationText = `${avgRoundDuration}秒`;
        
        const minutes = Math.floor(this.trainingData.totalDuration / 60000);
        const seconds = Math.floor((this.trainingData.totalDuration % 60000) / 1000);
        const duration = `${minutes}分${seconds}秒`;

        return {
            duration,
            totalRounds,
            maxScore,
            avgScore,
            avgRoundDuration: avgRoundDurationText
        };
    }

    extractCognitiveInsights(cognitiveMetrics) {
        const overall = cognitiveMetrics.overallAssessment;
        const exec = cognitiveMetrics.executiveFunction;
        const attention = cognitiveMetrics.attention;
        const learning = cognitiveMetrics.learning;
        
        return {
            overallCognitiveIndex: overall.overallCognitiveIndex,
            cognitiveFlexibilityScore: overall.cognitiveFlexibilityScore,
            executiveFunctionScore: overall.executiveFunctionScore,
            attentionQualityScore: overall.attentionQualityScore,
            learningEfficiencyScore: overall.learningEfficiencyScore,
            planningAbility: exec.planningAbility.planningScore,
            attentionMaintenance: attention.sustainedAttention.attentionMaintenance,
            improvementTrend: learning.learningCurve.improvementTrend,
            // 数据质量
            dataQuality: cognitiveMetrics.analysisMetadata.dataQuality.level
        };
    }

    startTimer() {
        this.timer.startTime = Date.now() - this.timer.pausedTime;
        this.timer.interval = setInterval(() => {
            this.timer.current = Date.now() - this.timer.startTime;
            this.updateTimerDisplay();
        }, 1000);
    }

    pauseTimer() {
        if (this.timer.interval) {
            clearInterval(this.timer.interval);
            this.timer.interval = null;
            this.timer.pausedTime = this.timer.current;
        }
    }

    resumeTimer() {
        this.timer.startTime = Date.now() - this.timer.pausedTime;
        this.timer.interval = setInterval(() => {
            this.timer.current = Date.now() - this.timer.startTime;
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timer.interval) {
            clearInterval(this.timer.interval);
            this.timer.interval = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timer.current / 60000);
        const seconds = Math.floor((this.timer.current % 60000) / 1000);
        const timeText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.elements.timer.textContent = timeText;
        if (this.elements.timerCopy) {
            this.elements.timerCopy.textContent = timeText;
        }
    }

    start3MinuteTimer() {
        this.threeMinuteTimer = setTimeout(() => {
            this.show3MinuteReminder();
        }, 3 * 60 * 1000);
    }

    stop3MinuteTimer() {
        if (this.threeMinuteTimer) {
            clearTimeout(this.threeMinuteTimer);
            this.threeMinuteTimer = null;
        }
    }

    show3MinuteReminder() {
        alert('恭喜！您已完成3分钟训练。可以考虑结束训练查看游戏数据，或继续训练获得更多数据。');
    }

    // 接收游戏报告
    receiveGameReport(report) {
        this.trainingData.gameReports.push({
            timestamp: Date.now(),
            report: report
        });
        console.log('收到游戏报告:', report);
    }

    outputResults() {
        const results = {
            trainingInfo: {
                startTime: this.trainingData.startTime,
                endTime: this.trainingData.endTime,
                totalDuration: this.trainingData.totalDuration,
                totalGameReports: this.trainingData.gameReports.length
            },
            gameReports: this.trainingData.gameReports
        };
        
        // 构建JSON输出格式
        const outputData = {
            // 基本训练信息
            trainingInfo: {
                startTime: results.trainingInfo.startTime?.toISOString() || null,
                endTime: results.trainingInfo.endTime?.toISOString() || null,
                totalDurationSeconds: results.trainingInfo.totalDuration ? Math.round(results.trainingInfo.totalDuration / 1000) : 0,
                totalGameReports: results.trainingInfo.totalGameReports
            },
            
            // 游戏数据汇总
            gameDataSummary: this.generateGameSummary(results.gameReports),
            
            // 认知功能分析（仅用于数据分析，不向用户展示）
            cognitiveAnalysis: null,
            
            // 详细游戏数据
            detailedGameReports: results.gameReports,
            
            // 生成时间戳
            generatedAt: new Date().toISOString(),
            
            // 数据版本
            dataVersion: "1.0"
        };
        
        // 添加认知功能分析（如果有）
        const latestReport = results.gameReports[results.gameReports.length - 1];
        if (latestReport && latestReport.report.cognitiveMetrics) {
            outputData.cognitiveAnalysis = latestReport.report.cognitiveMetrics;
        }
        
        // 输出JSON格式
        console.log('\n' + '='.repeat(80));
        console.log('🎮 Snake游戏训练数据报告');
        console.log('='.repeat(80));
        console.log('\n📊 JSON格式输出（便于数据库存储）:');
        console.log(JSON.stringify(outputData, null, 2));
        console.log('\n' + '='.repeat(80));
        console.log('✅ 训练数据输出完成');
        console.log('='.repeat(80) + '\n');
    }

    generateGameSummary(gameReports) {
        if (!gameReports || gameReports.length === 0) {
            return {
                totalRounds: 0,
                totalScore: 0,
                averageScore: 0,
                maxScore: 0,
                totalDirectionChanges: 0,
                averageRoundDuration: 0,
                totalPlayTime: 0
            };
        }

        let totalScore = 0;
        let maxScore = 0;
        let totalDirectionChanges = 0;
        let totalDuration = 0;
        const roundScores = [];

        gameReports.forEach(report => {
            if (report.report && report.report.roundData) {
                const roundData = report.report.roundData;
                totalScore += roundData.score || 0;
                maxScore = Math.max(maxScore, roundData.score || 0);
                totalDirectionChanges += roundData.directionChanges || 0;
                totalDuration += roundData.duration || 0;
                roundScores.push(roundData.score || 0);
            }
        });

        return {
            totalRounds: gameReports.length,
            totalScore: totalScore,
            averageScore: Math.round((totalScore / gameReports.length) * 100) / 100,
            maxScore: maxScore,
            minScore: Math.min(...roundScores),
            totalDirectionChanges: totalDirectionChanges,
            averageDirectionChangesPerRound: Math.round((totalDirectionChanges / gameReports.length) * 100) / 100,
            averageRoundDurationSeconds: Math.round((totalDuration / gameReports.length / 1000) * 100) / 100,
            totalPlayTimeSeconds: Math.round(totalDuration / 1000),
            scoreImprovement: roundScores.length > 1 ? roundScores[roundScores.length - 1] - roundScores[0] : 0
        };
    }

    printCognitiveAnalysis(cognitiveMetrics) {
        console.log('\n🧠 认知功能分析结果:');
        console.log('-'.repeat(50));
        
        // 1. 综合认知指标
        console.log('\n🏆 综合认知评估:');
        const overall = cognitiveMetrics.overallAssessment;
        console.log(`总体认知指数: ${overall.overallCognitiveIndex} (满分1.0)`);
        console.log(`认知灵活性评分: ${overall.cognitiveFlexibilityScore} ${this.getScoreLevel(overall.cognitiveFlexibilityScore)}`);
        console.log(`执行功能评分: ${overall.executiveFunctionScore} ${this.getScoreLevel(overall.executiveFunctionScore)}`);
        console.log(`学习效率评分: ${overall.learningEfficiencyScore} ${this.getScoreLevel(overall.learningEfficiencyScore)}`);
        console.log(`注意力质量评分: ${overall.attentionQualityScore} ${this.getScoreLevel(overall.attentionQualityScore)}`);
        
        // 2. 执行功能详细分析
        console.log('\n⚡ 执行功能分析:');
        const exec = cognitiveMetrics.executiveFunction;
        console.log('📋 计划能力:');
        console.log(`  - 平均蛇长度: ${exec.planningAbility.avgSnakeLength} (反映前瞻性规划)`);
        console.log(`  - 得分效率: ${exec.planningAbility.scoreEfficiency} 分/秒`);
        console.log(`  - 最大蛇长度: ${exec.planningAbility.maxSnakeLength} (最佳规划成果)`);
        console.log(`  - 规划能力评分: ${exec.planningAbility.planningScore} ${this.getScoreLevel(exec.planningAbility.planningScore / 10)}`);
        
        console.log('🔄 认知灵活性:');
        console.log(`  - 平均转向次数: ${exec.cognitiveFlexibility.avgDirectionChanges} (决策活跃度)`);
        console.log(`  - 转向效率: ${exec.cognitiveFlexibility.turningEfficiency} 分/转向`);
        console.log(`  - 适应性指数: ${exec.cognitiveFlexibility.adaptabilityIndex} ${this.getScoreLevel(exec.cognitiveFlexibility.adaptabilityIndex)}`);
        
        console.log('🎯 冲动控制:');
        console.log(`  - 过度转向比率: ${exec.impulseControl.overTurningRatio} (越低越好)`);
        console.log(`  - 控制稳定性: ${exec.impulseControl.controlStability} ${this.getScoreLevel(exec.impulseControl.controlStability)}`);
        
        // 3. 注意力功能分析
        console.log('\n👁️ 注意力功能分析:');
        const attention = cognitiveMetrics.attention;
        console.log('⏰ 持续注意力:');
        console.log(`  - 平均游戏时长: ${attention.sustainedAttention.avgRoundDuration} 秒`);
        console.log(`  - 时长稳定性: ${attention.sustainedAttention.durationStability} ${this.getScoreLevel(attention.sustainedAttention.durationStability)}`);
        console.log(`  - 最长游戏时长: ${attention.sustainedAttention.longestRound} 秒`);
        console.log(`  - 注意力维持率: ${attention.sustainedAttention.attentionMaintenance} ${this.getScoreLevel(attention.sustainedAttention.attentionMaintenance)}`);
        
        console.log('🎛️ 注意力分配:');
        console.log(`  - 错误率: ${attention.attentionAllocation.errorRate} ${this.getErrorLevel(attention.attentionAllocation.errorRate)}`);
        console.log(`  - 恢复率: ${attention.attentionAllocation.recoveryRate} ${this.getScoreLevel(attention.attentionAllocation.recoveryRate)}`);
        console.log(`  - 一致性指数: ${attention.attentionAllocation.consistencyIndex} ${this.getScoreLevel(attention.attentionAllocation.consistencyIndex)}`);
        
        // 4. 学习能力分析
        console.log('\n📚 学习能力分析:');
        const learning = cognitiveMetrics.learning;
        console.log('📈 学习曲线:');
        console.log(`  - 改进趋势: ${learning.learningCurve.improvementTrend} ${this.getScoreLevel(learning.learningCurve.improvementTrend)}`);
        console.log(`  - 学习率: ${learning.learningCurve.learningRate} ${this.getLearningRateLevel(learning.learningCurve.learningRate)}`);
        console.log(`  - 是否达到平台期: ${learning.learningCurve.plateauReached ? '是' : '否'}`);
        console.log(`  - 适应速度: ${learning.learningCurve.adaptationSpeed} 轮 ${this.getAdaptationSpeedLevel(learning.learningCurve.adaptationSpeed)}`);
        
        // 5. 反应和决策分析
        console.log('\n⚡ 反应速度与决策分析:');
        const reaction = cognitiveMetrics.reactionDecision;
        console.log('🧠 决策效率:');
        console.log(`  - 平均决策时间: ${reaction.decisionEfficiency.avgDecisionTime} 秒/决策`);
        console.log(`  - 决策准确性: ${reaction.decisionEfficiency.decisionAccuracy} ${this.getScoreLevel(reaction.decisionEfficiency.decisionAccuracy)}`);
        console.log(`  - 反应速度: ${reaction.decisionEfficiency.responseSpeed} 分/秒`);
        
        console.log('🏋️ 认知负荷处理:');
        console.log(`  - 复杂度处理能力: ${reaction.cognitiveLoad.complexityHandling} ${this.getScoreLevel(reaction.cognitiveLoad.complexityHandling)}`);
        console.log(`  - 压力下表现: ${reaction.cognitiveLoad.performanceUnderPressure} ${this.getScoreLevel(reaction.cognitiveLoad.performanceUnderPressure)}`);
        console.log(`  - 多任务处理能力: ${reaction.cognitiveLoad.multitaskingAbility} ${this.getScoreLevel(reaction.cognitiveLoad.multitaskingAbility)}`);
        
        // 6. 空间认知分析
        console.log('\n🗺️ 空间认知分析:');
        const spatial = cognitiveMetrics.spatialCognition;
        console.log('🎯 空间规划:');
        console.log(`  - 空间利用率: ${spatial.spatialPlanning.spaceUtilization} ${this.getUtilizationLevel(spatial.spatialPlanning.spaceUtilization)}`);
        console.log(`  - 导航效率: ${spatial.spatialPlanning.navigationEfficiency} ${this.getScoreLevel(spatial.spatialPlanning.navigationEfficiency)}`);
        console.log(`  - 空间记忆: ${spatial.spatialPlanning.spatialMemory} ${this.getScoreLevel(spatial.spatialPlanning.spatialMemory)}`);
        
        // 7. 数据质量评估
        console.log('\n📊 数据质量评估:');
        const metadata = cognitiveMetrics.analysisMetadata;
        console.log(`数据质量等级: ${metadata.dataQuality.level} (${metadata.dataQuality.score})`);
        console.log(`建议: ${metadata.dataQuality.recommendation}`);
        console.log(`分析时间: ${new Date(metadata.analysisTimestamp).toLocaleString()}`);
        
        // 8. 临床解释和建议
        console.log('\n🩺 临床解释与建议:');
        this.printClinicalInterpretation(cognitiveMetrics);
    }

    getScoreLevel(score) {
        if (score >= 0.8) return '(优秀)';
        if (score >= 0.6) return '(良好)';
        if (score >= 0.4) return '(一般)';
        if (score >= 0.2) return '(较差)';
        return '(需要关注)';
    }

    getErrorLevel(errorRate) {
        if (errorRate <= 0.2) return '(低错误率-优秀)';
        if (errorRate <= 0.4) return '(中等错误率-良好)';
        if (errorRate <= 0.6) return '(较高错误率-一般)';
        return '(高错误率-需要关注)';
    }

    getLearningRateLevel(learningRate) {
        if (learningRate >= 0.3) return '(快速学习)';
        if (learningRate >= 0.1) return '(稳步学习)';
        if (learningRate >= 0) return '(缓慢学习)';
        return '(学习困难)';
    }

    getAdaptationSpeedLevel(adaptationSpeed) {
        if (adaptationSpeed <= 2) return '(快速适应)';
        if (adaptationSpeed <= 4) return '(正常适应)';
        if (adaptationSpeed <= 6) return '(缓慢适应)';
        return '(适应困难)';
    }

    getUtilizationLevel(utilization) {
        if (utilization >= 0.1) return '(高效利用)';
        if (utilization >= 0.05) return '(良好利用)';
        if (utilization >= 0.02) return '(一般利用)';
        return '(利用率低)';
    }

    printClinicalInterpretation(cognitiveMetrics) {
        const overall = cognitiveMetrics.overallAssessment;
        const exec = cognitiveMetrics.executiveFunction;
        const attention = cognitiveMetrics.attention;
        const learning = cognitiveMetrics.learning;
        
        console.log('\n🔍 认知功能特征分析:');
        
        // 总体认知水平
        if (overall.overallCognitiveIndex >= 0.7) {
            console.log('✅ 总体认知功能优秀，各项指标均衡发展');
        } else if (overall.overallCognitiveIndex >= 0.5) {
            console.log('⚠️ 总体认知功能良好，部分领域有提升空间');
        } else {
            console.log('❗ 总体认知功能需要关注，建议进行更详细的评估');
        }
        
        // 执行功能特征
        if (exec.planningAbility.planningScore >= 10) {
            console.log('🎯 计划能力突出，具有良好的前瞻性思维');
        } else if (exec.impulseControl.overTurningRatio > 2) {
            console.log('⚡ 建议加强冲动控制训练，减少不必要的操作');
        }
        
        // 注意力特征
        if (attention.sustainedAttention.attentionMaintenance >= 0.8) {
            console.log('👁️ 持续注意力优秀，能够长时间保持专注');
        } else if (attention.attentionAllocation.errorRate > 0.5) {
            console.log('⚠️ 注意力分配需要改善，建议进行专注力训练');
        }
        
        // 学习能力特征
        if (learning.learningCurve.improvementTrend >= 0.7) {
            console.log('📈 学习能力强，显示出良好的进步趋势');
        } else if (learning.learningCurve.learningRate < 0) {
            console.log('📉 学习效率有待提升，建议调整学习策略');
        }
        
        // 个性化建议
        console.log('\n💡 个性化训练建议:');
        
        if (overall.cognitiveFlexibilityScore < 0.5) {
            console.log('🔄 认知灵活性训练：尝试不同的游戏策略，提高适应能力');
        }
        
        if (overall.executiveFunctionScore < 0.5) {
            console.log('⚡ 执行功能训练：进行更多需要计划和决策的活动');
        }
        
        if (overall.learningEfficiencyScore < 0.5) {
            console.log('📚 学习效率训练：设定小目标，逐步提升技能');
        }
        
        if (overall.attentionQualityScore < 0.5) {
            console.log('👁️ 注意力训练：进行冥想或专注力练习');
        }
        
        console.log('\n📝 数据对接说明:');
        console.log('• 所有评分均为0-1标准化分值，便于统计分析');
        console.log('• 认知指标基于心理学和神经科学研究设计');
        console.log('• 建议结合其他评估工具进行综合分析');
        console.log('• 可将数据导出为JSON格式供进一步分析');
    }

    handleBack() {
        const currentDuration = this.timer.current || 0;
        const minutes = Math.floor(currentDuration / 60000);
        const seconds = Math.floor((currentDuration % 60000) / 1000);
        const timeText = `${minutes}分${seconds}秒`;
        
        let message;
        if (this.trainingData.status === 'training' || this.trainingData.status === 'paused') {
            if (currentDuration < 3 * 60 * 1000) {
                message = `您的当前训练时长为${timeText}。\n\n建议训练时长至少3分钟以获得更好的训练效果。确定要返回吗？当前训练数据将被输出到控制台。`;
            } else {
                message = `您的训练时长为${timeText}，已达到建议时长。\n\n确定要返回吗？训练数据将被输出到控制台。`;
            }
        } else {
            message = '确定要返回吗？';
        }
        
        if (confirm(message)) {
            this.outputResults();
            window.location.href = 'index.html';
        }
    }

    // 通知游戏系统
    notifyGame(event, data = {}) {
        const gameEvent = new CustomEvent('trainingSystemEvent', {
            detail: { event, data }
        });
        window.dispatchEvent(gameEvent);
    }

    // 获取训练状态
    getTrainingStatus() {
        return this.trainingData.status;
    }
}

// 通用训练API
window.TrainingAPI = {
    reportGameData: (report) => trainingSystem.receiveGameReport(report),
    getTrainingStatus: () => trainingSystem.getTrainingStatus()
};

// 创建全局实例
const trainingSystem = new TrainingSystem();

console.log('通用训练系统已加载'); 
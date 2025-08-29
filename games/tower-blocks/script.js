// 在文件开头添加GSAP插件注册
gsap.registerPlugin(Power1);

console.clear();

// 添加辅助函数
function mean(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function std(arr) {
    if (!arr || arr.length === 0) return 0;
    const m = mean(arr);
    return Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / arr.length);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

class Stage {
    constructor() {
        // container
        this.container = document.getElementById('game');
        
        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor('#D0CBC7', 1);
        this.container.appendChild(this.renderer.domElement);
        
        // scene
        this.scene = new THREE.Scene();
        
        // camera
        let aspect = window.innerWidth / window.innerHeight;
        let d = 35;
        this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -100, 1000);
        this.camera.position.x = 6;
        this.camera.position.y = 8;
        this.camera.position.z = 6;
        this.camera.lookAt(new THREE.Vector3(0, -4, 0));
        
        //light
        this.light = new THREE.DirectionalLight(0xffffff, 0.5);
        this.light.position.set(0, 499, 0);
        this.scene.add(this.light);
        
        this.softLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(this.softLight);
        
        window.addEventListener('resize', () => this.onResize());
        this.onResize();
    }
    
    setCamera(y, speed = 0.3) {
        gsap.to(this.camera.position, {
            duration: speed,
            y: y + 8,
            ease: "power1.inOut"
        });
        
        gsap.to(this.camera.lookAt, {
            duration: speed,
            y: y - 4,
            ease: "power1.inOut"
        });
    }
    
    onResize() {
        let viewSize = 40;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        let containerAspect = this.container.clientWidth / this.container.clientHeight;
        
        this.camera.left = -viewSize * containerAspect;
        this.camera.right = viewSize * containerAspect;
        this.camera.top = viewSize;
        this.camera.bottom = -viewSize;
        
        this.camera.updateProjectionMatrix();
    }
    
    render = function() {
        this.renderer.render(this.scene, this.camera);
    }
    
    add = function(elem) {
        this.scene.add(elem);
    }
    
    remove = function(elem) {
        this.scene.remove(elem);
    }
}

class Block {
    constructor(block) {
        // Constants
        this.STATES = { ACTIVE: 'active', STOPPED: 'stopped', MISSED: 'missed' };
        this.MOVE_AMOUNT = 12;
        
        this.dimension = { width: 0, height: 0, depth: 0 };
        this.position = { x: 0, y: 0, z: 0 };
        
        // set size and position
        this.targetBlock = block;
        
        this.index = (this.targetBlock ? this.targetBlock.index : 0) + 1;
        this.workingPlane = this.index % 2 ? 'x' : 'z';
        this.workingDimension = this.index % 2 ? 'width' : 'depth';
        
        // set the dimensions from the target block, or defaults.
        this.dimension.width = this.targetBlock ? this.targetBlock.dimension.width : 10;
        this.dimension.height = this.targetBlock ? this.targetBlock.dimension.height : 2;
        this.dimension.depth = this.targetBlock ? this.targetBlock.dimension.depth : 10;
        
        this.position.x = this.targetBlock ? this.targetBlock.position.x : 0;
        this.position.y = this.dimension.height * this.index;
        this.position.z = this.targetBlock ? this.targetBlock.position.z : 0;
        
        this.colorOffset = this.targetBlock ? this.targetBlock.colorOffset : Math.round(Math.random() * 100);
        
        // set color
        if (!this.targetBlock) {
            this.color = 0x333344;
        }
        else {
            let offset = this.index + this.colorOffset;
            var r = Math.sin(0.3 * offset) * 55 + 200;
            var g = Math.sin(0.3 * offset + 2) * 55 + 200;
            var b = Math.sin(0.3 * offset + 4) * 55 + 200;
            this.color = new THREE.Color(r / 255, g / 255, b / 255);
        }
        
        // state
        this.state = this.index > 1 ? this.STATES.ACTIVE : this.STATES.STOPPED;
        
        // set direction
        this.speed = -0.1 - (this.index * 0.005);
        if (this.speed < -4) this.speed = -4;
        this.direction = this.speed;
        
        // create block
        let geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
        geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(this.dimension.width/2, this.dimension.height/2, this.dimension.depth/2));
        this.material = new THREE.MeshToonMaterial({ 
            color: this.color, 
            flatShading: true 
        });
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.set(this.position.x, this.position.y + (this.state == this.STATES.ACTIVE ? 0 : 0), this.position.z);
        
        if (this.state == this.STATES.ACTIVE) {
            this.position[this.workingPlane] = Math.random() > 0.5 ? -this.MOVE_AMOUNT : this.MOVE_AMOUNT;
        }
    }
    
    reverseDirection() {
        this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
    }
    
    place() {
        this.state = this.STATES.STOPPED;
        
        let overlap = this.targetBlock.dimension[this.workingDimension] - Math.abs(this.position[this.workingPlane] - this.targetBlock.position[this.workingPlane]);
        
        let blocksToReturn = {
            plane: this.workingPlane,
            direction: this.direction
        };
        
        if (this.dimension[this.workingDimension] - overlap < 0.3) {
            overlap = this.dimension[this.workingDimension];
            blocksToReturn.bonus = true;
            this.position.x = this.targetBlock.position.x;
            this.position.z = this.targetBlock.position.z;
            this.dimension.width = this.targetBlock.dimension.width;
            this.dimension.depth = this.targetBlock.dimension.depth;
        }
        
        if (overlap > 0) {
            let choppedDimensions = { width: this.dimension.width, height: this.dimension.height, depth: this.dimension.depth };
            choppedDimensions[this.workingDimension] -= overlap;
            this.dimension[this.workingDimension] = overlap;
            
            let placedGeometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
            placedGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(this.dimension.width/2, this.dimension.height/2, this.dimension.depth/2));
            let placedMesh = new THREE.Mesh(placedGeometry, this.material);
            
            let choppedGeometry = new THREE.BoxGeometry(choppedDimensions.width, choppedDimensions.height, choppedDimensions.depth);
            choppedGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(choppedDimensions.width/2, choppedDimensions.height/2, choppedDimensions.depth/2));
            let choppedMesh = new THREE.Mesh(choppedGeometry, this.material);
            
            let choppedPosition = {
                x: this.position.x,
                y: this.position.y,
                z: this.position.z
            };
            
            if (this.position[this.workingPlane] < this.targetBlock.position[this.workingPlane]) {
                this.position[this.workingPlane] = this.targetBlock.position[this.workingPlane];
            }
            else {
                choppedPosition[this.workingPlane] += overlap;
            }
            
            placedMesh.position.set(this.position.x, this.position.y, this.position.z);
            choppedMesh.position.set(choppedPosition.x, choppedPosition.y, choppedPosition.z);
            
            blocksToReturn.placed = placedMesh;
            if (!blocksToReturn.bonus) blocksToReturn.chopped = choppedMesh;
        }
        else {
            this.state = this.STATES.MISSED;
        }
        
        this.dimension[this.workingDimension] = overlap;
        
        return blocksToReturn;
    }
    
    tick() {
        if (this.state == this.STATES.ACTIVE) {
            let value = this.position[this.workingPlane];
            if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT) this.reverseDirection();
            this.position[this.workingPlane] += this.direction;
            this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
        }
    }
}

class Game {
    constructor() {
        this.STATES = {
            'LOADING': 'loading',
            'PLAYING': 'playing',
            'READY': 'ready',
            'ENDED': 'ended',
            'RESETTING': 'resetting',
            'PAUSED': 'paused'  // 新增暂停状态
        };
        
        this.blocks = [];
        this.state = this.STATES.LOADING;
        
        this.stage = new Stage();
        
        this.mainContainer = document.getElementById('container');
        this.scoreContainer = document.getElementById('score');
        this.startButton = document.getElementById('start-button');
        this.instructions = document.getElementById('instructions');
        this.scoreContainer.innerHTML = '0';
        
        this.newBlocks = new THREE.Group();
        this.placedBlocks = new THREE.Group();
        this.choppedBlocks = new THREE.Group();
        
        this.stage.add(this.newBlocks);
        this.stage.add(this.placedBlocks);
        this.stage.add(this.choppedBlocks);
        
        this.addBlock();
        this.tick();
        
        this.updateState(this.STATES.READY);
        
        // 添加训练数据管理
        this.trainingData = {
            isTrainingActive: false,
            rounds: [],
            currentRoundData: null,
            totalStats: {
                totalRounds: 0,
                totalScore: 0,
                totalBlocks: 0,
                perfectPlacements: 0,
                avgScore: 0,
                avgBlocksPerRound: 0,
                avgPerfectRate: 0,
                bestScore: 0,
                worstScore: Infinity,
                totalDuration: 0,
                avgDuration: 0
            }
        };
        
        this.initializeGame();
        this.bindEvents();
    }
    
    // 训练系统集成
    initializeGame() {
        window.addEventListener('trainingSystemEvent', (event) => {
            this.handleTrainingEvent(event.detail);
        });
    }
    
    handleTrainingEvent(eventDetail) {
        switch (eventDetail.event) {
            case 'training_start':
                this.startTraining();
                break;
            case 'training_pause':
                this.pauseTraining();
                break;
            case 'training_resume':
                this.resumeTraining();
                break;
            case 'training_end':
                this.endTraining();
                break;
        }
    }
    
    startTraining() {
        this.trainingData.isTrainingActive = true;
        if (this.state === this.STATES.READY) {
            this.startGame();
        }
        console.log('训练开始');
    }
    
    pauseTraining() {
        if (this.state === this.STATES.PLAYING) {
            this.state = this.STATES.PAUSED;
            this.showPausedMessage();
        }
        console.log('训练暂停');
    }
    
    resumeTraining() {
        if (this.state === this.STATES.PAUSED) {
            this.state = this.STATES.PLAYING;
            this.tick();
        }
        console.log('训练继续');
    }
    
    endTraining() {
        // 如果当前轮次还在进行,先结束当前轮次
        if (this.state === this.STATES.PLAYING || this.state === this.STATES.PAUSED) {
            this.endGame(true);  // true表示是由训练结束触发的
        }
        
        this.trainingData.isTrainingActive = false;
        this.showTrainingEndMessage();
        this.outputTrainingResults();
        console.log('训练结束');
    }
    
    showPausedMessage() {
        const message = document.createElement('div');
        message.id = 'pause-message';
        message.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #f39c12;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        message.innerHTML = `
            <div>游戏已暂停</div>
            <div style="font-size: 16px; margin-top: 10px;">点击继续按钮恢复游戏</div>
        `;
        
        const existingMessage = document.getElementById('pause-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        this.mainContainer.appendChild(message);
    }
    
    showTrainingEndMessage() {
        const message = document.createElement('div');
        message.id = 'end-message';
        message.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #e74c3c;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        message.innerHTML = `
            <div>训练结束</div>
            <div style="font-size: 16px; margin-top: 10px;">查看控制台获取详细结果</div>
        `;
        
        const existingMessage = document.getElementById('end-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        this.mainContainer.appendChild(message);
    }

    startGame() {
        if (!this.trainingData.isTrainingActive) return;
        
        this.scoreContainer.innerHTML = '0';
        this.updateState(this.STATES.PLAYING);
        
        // 初始化当前轮次数据
        this.trainingData.currentRoundData = {
            roundNumber: this.trainingData.rounds.length + 1,
            startTime: Date.now(),
            endTime: null,
            duration: 0,
            score: 0,
            totalBlocks: 0,
            perfectPlacements: 0,
            placementAccuracy: [],
            placementTimes: [],
            lastPlacementTime: Date.now()
        };
        
        this.addBlock();
    }

    endGame(isTrainingEnd = false) {
        if (this.trainingData.currentRoundData) {
            // 完成当前轮次数据
            this.trainingData.currentRoundData.endTime = Date.now();
            this.trainingData.currentRoundData.duration = 
                this.trainingData.currentRoundData.endTime - this.trainingData.currentRoundData.startTime;
            this.trainingData.currentRoundData.score = parseInt(this.scoreContainer.innerHTML);
            
            // 保存轮次数据
            this.trainingData.rounds.push({...this.trainingData.currentRoundData});
            
            // 更新总体统计
            this.updateTotalStats();
            
            // 报告给训练系统
            this.reportToTrainingSystem();
        }
        
        // 更新游戏状态
        this.updateState(this.STATES.ENDED);
        
        // 如果是训练结束,显示训练结束消息
        if (isTrainingEnd) {
            this.showTrainingEndMessage();
        }
    }

    updateTotalStats() {
        const stats = this.trainingData.totalStats;
        const currentRound = this.trainingData.currentRoundData;
        
        stats.totalRounds++;
        stats.totalScore += currentRound.score;
        stats.totalBlocks += currentRound.totalBlocks;
        stats.perfectPlacements += currentRound.perfectPlacements;
        stats.totalDuration += currentRound.duration;
        
        // 更新最好和最差分数
        stats.bestScore = Math.max(stats.bestScore, currentRound.score);
        stats.worstScore = stats.worstScore === Infinity ? 
            currentRound.score : Math.min(stats.worstScore, currentRound.score);
        
        // 计算平均值
        stats.avgScore = Math.round((stats.totalScore / stats.totalRounds) * 100) / 100;
        stats.avgBlocksPerRound = Math.round((stats.totalBlocks / stats.totalRounds) * 100) / 100;
        stats.avgPerfectRate = stats.totalBlocks > 0 ? 
            stats.perfectPlacements / stats.totalBlocks : 0;
        stats.avgDuration = Math.round((stats.totalDuration / stats.totalRounds) / 10) / 100;
    }

    outputTrainingResults() {
        const stats = this.trainingData.totalStats;
        
        console.log('\n========== Tower Blocks 训练数据报告 ==========');
        console.log('\n1. 总体统计:');
        console.log(`总轮次: ${stats.totalRounds}`);
        console.log(`总分数: ${stats.totalScore}`);
        console.log(`总方块数: ${stats.totalBlocks}`);
        console.log(`完美放置次数: ${stats.perfectPlacements}`);
        console.log(`平均每轮得分: ${stats.avgScore}`);
        console.log(`平均每轮方块数: ${stats.avgBlocksPerRound}`);
        console.log(`完美放置率: ${(stats.avgPerfectRate * 100).toFixed(2)}%`);
        console.log(`最高分: ${stats.bestScore}`);
        console.log(`最低分: ${stats.worstScore === Infinity ? 0 : stats.worstScore}`);
        console.log(`平均轮次时长: ${stats.avgDuration}秒`);
        
        console.log('\n2. 轮次详情:');
        this.trainingData.rounds.forEach((round, index) => {
            console.log(`\n轮次 ${index + 1}:`);
            console.log(`得分: ${round.score}`);
            console.log(`持续时间: ${(round.duration / 1000).toFixed(2)}秒`);
            console.log(`方块数: ${round.totalBlocks}`);
            console.log(`完美放置: ${round.perfectPlacements}`);
            console.log(`完美率: ${round.totalBlocks > 0 ? 
                ((round.perfectPlacements / round.totalBlocks) * 100).toFixed(2) : 0}%`);
        });
        
        console.log('\n3. 认知指标分析:');
        const cognitiveMetrics = this.calculateCognitiveMetrics();
        if (cognitiveMetrics) {
            console.log('空间认知:');
            console.log(`- 平均放置精确度: ${(cognitiveMetrics.spatialCognition.placementAccuracy.average * 100).toFixed(2)}%`);
            console.log(`- 空间规划效率: ${cognitiveMetrics.spatialCognition.spatialPlanning.efficiency.toFixed(2)}`);
            
            console.log('\n执行功能:');
            console.log(`- 决策一致性: ${(cognitiveMetrics.executiveFunction.decisionMaking.decisionConsistency * 100).toFixed(2)}%`);
            console.log(`- 规划能力: ${(cognitiveMetrics.executiveFunction.planningAbility.successRate * 100).toFixed(2)}%`);
        }
        
        console.log('\n===========================================\n');
    }
    
    updateState(newState) {
        for (let key in this.STATES)
            this.mainContainer.classList.remove(this.STATES[key]);
        this.mainContainer.classList.add(newState);
        this.state = newState;
    }
    
    onAction() {
        switch (this.state) {
            case this.STATES.READY:
                this.startGame();
                break;
            case this.STATES.PLAYING:
                this.placeBlock();
                break;
            case this.STATES.ENDED:
                this.restartGame();
                break;
        }
    }
    
    restartGame() {
        this.updateState(this.STATES.RESETTING);
        
        let oldBlocks = this.placedBlocks.children;
        let removeSpeed = 0.2;
        let delayAmount = 0.02;
        for (let i = 0; i < oldBlocks.length; i++) {
            TweenLite.to(oldBlocks[i].scale, removeSpeed, {
                x: 0,
                y: 0,
                z: 0,
                delay: (oldBlocks.length - i) * delayAmount,
                ease: Power1.easeIn,
                onComplete: () => this.placedBlocks.remove(oldBlocks[i])
            });
            TweenLite.to(oldBlocks[i].rotation, removeSpeed, {
                y: 0.5,
                delay: (oldBlocks.length - i) * delayAmount,
                ease: Power1.easeIn
            });
        }
        let cameraMoveSpeed = removeSpeed * 2 + (oldBlocks.length * delayAmount);
        this.stage.setCamera(2, cameraMoveSpeed);
        
        let countdown = { value: this.blocks.length - 1 };
        TweenLite.to(countdown, cameraMoveSpeed, {
            value: 0,
            onUpdate: () => { this.scoreContainer.innerHTML = String(Math.round(countdown.value)); }
        });
        
        this.blocks = this.blocks.slice(0, 1);
        
        setTimeout(() => {
            this.startGame();
        }, cameraMoveSpeed * 1000);
    }
    
    placeBlock() {
        let currentBlock = this.blocks[this.blocks.length - 1];
        let newBlocks = currentBlock.place();
        this.newBlocks.remove(currentBlock.mesh);
        
        // 记录放置数据
        if (this.trainingData.currentRoundData) {
            this.trainingData.currentRoundData.totalBlocks++;
            
            // 计算放置精确度
            if (newBlocks.placed && currentBlock.targetBlock) {
                const accuracy = newBlocks.bonus ? 1 : 
                    (currentBlock.dimension[currentBlock.workingDimension] / 
                     currentBlock.targetBlock.dimension[currentBlock.workingDimension]);
                this.trainingData.currentRoundData.placementAccuracy.push(accuracy);
                
                // 记录完美放置
                if (newBlocks.bonus) {
                    this.trainingData.currentRoundData.perfectPlacements++;
                }
            }
            
            // 记录放置时间
            const currentTime = Date.now();
            if (this.trainingData.currentRoundData.lastPlacementTime) {
                this.trainingData.currentRoundData.placementTimes.push(
                    currentTime - this.trainingData.currentRoundData.lastPlacementTime
                );
            }
            this.trainingData.currentRoundData.lastPlacementTime = currentTime;
        }
        
        if (newBlocks.placed) this.placedBlocks.add(newBlocks.placed);
        if (newBlocks.chopped) {
            this.choppedBlocks.add(newBlocks.chopped);
            let positionParams = {
                y: '-=30',
                ease: Power1.easeIn,
                onComplete: () => this.choppedBlocks.remove(newBlocks.chopped)
            };
            let rotateRandomness = 10;
            let rotationParams = {
                delay: 0.05,
                x: newBlocks.plane == 'z' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                z: newBlocks.plane == 'x' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                y: Math.random() * 0.1,
            };
            if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
                positionParams[newBlocks.plane] = '+=' + (40 * Math.abs(newBlocks.direction));
            }
            else {
                positionParams[newBlocks.plane] = '-=' + (40 * Math.abs(newBlocks.direction));
            }
            TweenLite.to(newBlocks.chopped.position, 1, positionParams);
            TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
        }
        
        this.addBlock();
    }
    
    addBlock() {
        let lastBlock = this.blocks[this.blocks.length - 1];
        
        if (lastBlock && lastBlock.state == lastBlock.STATES.MISSED) {
            return this.endGame();
        }
        
        this.scoreContainer.innerHTML = String(this.blocks.length - 1);
        
        let newKidOnTheBlock = new Block(lastBlock);
        this.newBlocks.add(newKidOnTheBlock.mesh);
        this.blocks.push(newKidOnTheBlock);
        
        this.stage.setCamera(this.blocks.length * 2);
        
        if (this.blocks.length >= 5)
            this.instructions.classList.add('hide');
    }
    
    tick() {
        if (this.state === this.STATES.PLAYING) {
            this.blocks[this.blocks.length - 1].tick();
        }
        this.stage.render();
        requestAnimationFrame(() => { this.tick(); });
    }
    
    bindEvents() {
        document.addEventListener('keydown', e => {
            if (e.keyCode == 32) this.onAction();
        });
        
        document.addEventListener('click', e => {
            this.onAction();
        });
        
        document.addEventListener('touchstart', e => {
            e.preventDefault();
        });
    }
    
    // 修改认知指标计算相关的方法
    calculateCognitiveMetrics() {
        const rounds = this.trainingData.rounds;
        if (rounds.length === 0) return null;
        
        // 获取最新轮次数据
        const latestRound = rounds[rounds.length - 1];
        
        // 基础计算
        const accuracyMean = mean(latestRound.placementAccuracy);
        const accuracyStd = std(latestRound.placementAccuracy);
        const timingMean = mean(latestRound.placementTimes);
        const timingStd = std(latestRound.placementTimes);
        
        return {
            // 空间认知能力
            spatialCognition: {
                placementAccuracy: {
                    average: accuracyMean,
                    consistency: clamp(1 - accuracyStd, 0, 1),
                    perfectRate: latestRound.perfectPlacements / latestRound.totalBlocks
                },
                spatialPlanning: {
                    efficiency: latestRound.score / (latestRound.duration / 1000),
                    adaptability: this.calculateAdaptability(rounds)
                }
            },
            
            // 执行功能
            executiveFunction: {
                decisionMaking: {
                    averageDecisionTime: timingMean,
                    decisionConsistency: clamp(1 - timingStd / timingMean, 0, 1)
                },
                planningAbility: {
                    successRate: latestRound.score / (latestRound.totalBlocks * 10),
                    strategyEfficiency: this.calculateStrategyEfficiency(rounds)
                }
            },
            
            // 注意力
            attention: {
                sustainedAttention: {
                    focusDuration: latestRound.duration / 1000,
                    performanceStability: this.calculatePerformanceStability(latestRound)
                },
                attentionQuality: {
                    errorRate: 1 - (latestRound.score / (latestRound.totalBlocks * 10)),
                    recoveryRate: this.calculateRecoveryRate(latestRound)
                }
            },
            
            // 手眼协调
            motorControl: {
                timing: {
                    averageSpeed: timingMean,
                    speedConsistency: clamp(1 - timingStd / timingMean, 0, 1)
                },
                precision: {
                    overallAccuracy: accuracyMean,
                    stabilityIndex: clamp(1 - accuracyStd, 0, 1)
                }
            },
            
            // 学习与进步
            learningProgress: {
                scoreImprovement: this.calculateScoreImprovement(rounds),
                skillMastery: this.calculateSkillMastery(rounds)
            },
            
            // 元数据
            metadata: {
                totalRounds: rounds.length,
                lastRoundDuration: latestRound.duration / 1000,
                totalBlocks: latestRound.totalBlocks,
                averageScore: mean(rounds.map(r => r.score))
            }
        };
    }

    // 修改辅助计算方法
    calculatePerformanceStability(round) {
        if (!round || !round.placementAccuracy || round.placementAccuracy.length === 0) {
            return 0;
        }
        const blockScores = round.placementAccuracy.map(acc => acc * 10);
        return clamp(1 - std(blockScores) / 10, 0, 1);
    }

    calculateRecoveryRate(round) {
        if (!round || !round.placementAccuracy || round.placementAccuracy.length < 2) {
            return 0;
        }
        
        const accuracies = round.placementAccuracy;
        let recoveries = 0;
        let drops = 0;
        
        for (let i = 1; i < accuracies.length; i++) {
            if (accuracies[i] > accuracies[i-1]) recoveries++;
            if (accuracies[i] < accuracies[i-1]) drops++;
        }
        
        return drops > 0 ? clamp(recoveries / drops, 0, 1) : 1;
    }

    calculateScoreImprovement(rounds) {
        if (!rounds || rounds.length < 2) return 0;
        const firstHalf = rounds.slice(0, Math.floor(rounds.length / 2));
        const secondHalf = rounds.slice(Math.floor(rounds.length / 2));
        return mean(secondHalf.map(r => r.score)) - mean(firstHalf.map(r => r.score));
    }

    calculateSkillMastery(rounds) {
        if (!rounds || rounds.length === 0) return 0;
        const perfectRates = rounds.map(r => r.perfectPlacements / r.totalBlocks);
        return clamp(mean(perfectRates), 0, 1);
    }

    calculateAdaptability(rounds) {
        if (!rounds || rounds.length < 2) return 0;
        const scores = rounds.map(r => r.score);
        const improvements = scores.slice(1).map((score, i) => score - scores[i]);
        return clamp(mean(improvements) / 10, 0, 1);
    }

    calculateStrategyEfficiency(rounds) {
        if (!rounds || rounds.length === 0) return 0;
        return clamp(rounds[rounds.length - 1].score / rounds[rounds.length - 1].totalBlocks, 0, 1);
    }

    // 添加报告方法
    reportToTrainingSystem() {
        const report = {
            gameType: 'tower_blocks',
            currentRound: this.trainingData.currentRoundData.roundNumber,
            roundData: this.trainingData.currentRoundData,
            totalStats: this.trainingData.totalStats,
            cognitiveMetrics: this.calculateCognitiveMetrics()
        };
        
        // 输出到控制台
        console.log('\n========== Tower Blocks 游戏数据报告 ==========');
        console.log('\n1. 基本统计信息:');
        console.log(`总轮次: ${this.trainingData.totalStats.totalRounds}`);
        console.log(`总分数: ${this.trainingData.totalStats.totalScore}`);
        console.log(`总方块数: ${this.trainingData.totalStats.totalBlocks}`);
        console.log(`完美放置次数: ${this.trainingData.totalStats.perfectPlacements}`);
        
        console.log('\n2. 当前轮次数据:');
        console.log(`轮次编号: ${this.trainingData.currentRoundData.roundNumber}`);
        console.log(`得分: ${this.trainingData.currentRoundData.score}`);
        console.log(`持续时间: ${(this.trainingData.currentRoundData.duration / 1000).toFixed(2)}秒`);
        console.log(`放置方块数: ${this.trainingData.currentRoundData.totalBlocks}`);
        console.log(`完美放置率: ${(this.trainingData.currentRoundData.perfectPlacements / this.trainingData.currentRoundData.totalBlocks * 100).toFixed(2)}%`);
        
        console.log('\n3. 认知能力评估:');
        const metrics = this.calculateCognitiveMetrics();
        console.log('空间认知能力:');
        console.log(`- 平均放置精确度: ${(metrics.spatialCognition.placementAccuracy.average * 100).toFixed(2)}%`);
        console.log(`- 空间规划效率: ${metrics.spatialCognition.spatialPlanning.efficiency.toFixed(2)} 分/秒`);
        
        console.log('\n执行功能:');
        console.log(`- 平均决策时间: ${metrics.executiveFunction.decisionMaking.averageDecisionTime.toFixed(2)}ms`);
        console.log(`- 决策一致性: ${(metrics.executiveFunction.decisionMaking.decisionConsistency * 100).toFixed(2)}%`);
        
        console.log('\n注意力:');
        console.log(`- 持续专注时间: ${metrics.attention.sustainedAttention.focusDuration.toFixed(2)}秒`);
        console.log(`- 表现稳定性: ${(metrics.attention.sustainedAttention.performanceStability * 100).toFixed(2)}%`);
        
        console.log('\n手眼协调:');
        console.log(`- 操作精确度: ${(metrics.motorControl.precision.overallAccuracy * 100).toFixed(2)}%`);
        console.log(`- 稳定性指数: ${(metrics.motorControl.precision.stabilityIndex * 100).toFixed(2)}%`);
        
        console.log('\n学习进步:');
        console.log(`- 分数提升: ${metrics.learningProgress.scoreImprovement.toFixed(2)}分`);
        console.log(`- 技能掌握度: ${(metrics.learningProgress.skillMastery * 100).toFixed(2)}%`);
        
        console.log('\n===========================================\n');
        
        // 报告给训练系统
        if (window.TrainingAPI) {
            TrainingAPI.reportGameData(report);
        }
    }
}

let game = new Game(); 
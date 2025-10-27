/** @jsxImportSource @emotion/react */
'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/react'

const GAME_CONFIG = {
  GRAVITY: 0.8,
  MAX_JUMP_HEIGHT: 12,
  MIN_JUMP_HEIGHT: 12,
  SPEED: 6,
  ACCELERATION: 0.001,
  CLOUD_FREQUENCY: 0.5,
  MAX_CLOUDS: 6,
  TREX_WIDTH: 44,
  TREX_HEIGHT: 47,
  OBSTACLE_WIDTH: 20,
  OBSTACLE_HEIGHT: 40,
  GROUND_HEIGHT: 12,
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 150,
  FPS: 60,
  OBSTACLE_MIN_GAP: 800,
  OBSTACLE_MAX_GAP: 1800,
  SPEED_INCREMENT: 0.5,
  MAX_SPEED: 13,
  SCORE_INCREMENT_INTERVAL: 100
}

const OBSTACLE_TYPES = ['pass', 'pass1']

const KEY_CODES = {
  SPACE: 'Space',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown'
}

const groundMove = keyframes`
    from { background-position: 0 0; }
    to { background-position: -4px 0; }
`

const walkAnimation = keyframes`
    0% { background-image: url('/assets/404/walk.png'); }
    50% { background-image: url('/assets/404/walk-2.png'); }
    100% { background-image: url('/assets/404/walk.png'); }
`

const GameContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const GameCanvas = styled.div`
    position: relative;
    width: ${GAME_CONFIG.CANVAS_WIDTH}px;
    height: ${GAME_CONFIG.CANVAS_HEIGHT}px;
    border: 1px solid #535353;
    overflow: hidden;
`

const TRex = styled.div`
    position: absolute;
    bottom: ${GAME_CONFIG.GROUND_HEIGHT}px;
    left: 25px;
    width: ${GAME_CONFIG.TREX_WIDTH}px;
    height: ${GAME_CONFIG.TREX_HEIGHT}px;
    background-image: url('/assets/404/walk.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    z-index: 10;
    transform: translateY(${props => -props.jumpHeight}px);
    transition: none;

    ${props => props.isRunning && css`
        animation: ${walkAnimation} 0.4s infinite;
    `}

    ${props => props.isJumping && css`
        background-image: url('/assets/404/jump.png');
        animation: none;
    `}

    ${props => props.isDucking && css`
        background-image: url('/assets/404/slide.png');
        animation: none;
    `}
`

const Obstacle = styled.div`
    position: absolute;
    bottom: ${props => props.type === 'pass1' 
        ? GAME_CONFIG.GROUND_HEIGHT + 30 
        : GAME_CONFIG.GROUND_HEIGHT}px;
    width: ${props => props.width || GAME_CONFIG.OBSTACLE_WIDTH}px;
    height: ${props => props.height || GAME_CONFIG.OBSTACLE_HEIGHT}px;
    left: ${props => props.x}px;
    z-index: 5;
    background-image: url(${props => props.type === 'pass1' ? '/assets/404/pass1.png' : '/assets/404/pass.png'});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
`

const Ground = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${GAME_CONFIG.GROUND_HEIGHT}px;
    background-color: #535353;
    background-image: repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 2px,
        #535353 2px,
        #535353 4px
    );

    ${props => props.isMoving && css`
        animation: ${groundMove} 1s linear infinite;
    `}
`

const ScoreDisplay = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #535353;
    z-index: 100;

    .current-score {
        display: inline-block;
        min-width: 60px;
        text-align: right;
    }

    .high-score {
        margin-left: 12px;
        display: inline-block;
        min-width: 60px;
        text-align: right;
    }
`

const BaseButton = styled.button`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 40px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
`

const StartButton = styled(BaseButton)`
    background-image: url('/assets/404/start_button.png');
`

const RestartButton = styled(BaseButton)`
    background-image: url('/assets/404/resatrt.png');
`

const useGame = () => {
    const [gameState, setGameState] = useState('waiting')
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [gameSpeed, setGameSpeed] = useState(GAME_CONFIG.SPEED)
    const [tRex, setTRex] = useState({
        jumping: false,
        ducking: false,
        jumpVelocity: 0,
        jumpHeight: 0
    })
    const [obstacles, setObstacles] = useState([])
    
    const gameLoopRef = useRef()
    const lastObstacleRef = useRef(0)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedHighScore = localStorage.getItem('dinoHighScore')
            if (savedHighScore) {
                setHighScore(parseInt(savedHighScore))
            }
        }
    }, [])

    const jump = useCallback(() => {
        if (gameState !== 'playing' || tRex.jumping || tRex.ducking) return
        
        setTRex(prev => ({
            ...prev,
            jumping: true,
            jumpVelocity: GAME_CONFIG.MAX_JUMP_HEIGHT
        }))
    }, [gameState, tRex.jumping, tRex.ducking])

    const duck = useCallback((isDucking) => {
        if (gameState !== 'playing' || tRex.jumping) return
        
        setTRex(prev => ({
            ...prev,
            ducking: isDucking
        }))
    }, [gameState, tRex.jumping])

    const startGame = useCallback(() => {
        setGameState('playing')
        setScore(0)
        setGameSpeed(GAME_CONFIG.SPEED)
        setObstacles([])
        setTRex({
            jumping: false,
            ducking: false,
            jumpVelocity: 0,
            jumpHeight: 0
        })
        lastObstacleRef.current = 0
    }, [])

    const gameOver = useCallback(() => {
        setGameState('gameOver')
        if (score > highScore) {
            setHighScore(score)
            if (typeof window !== 'undefined') {
                localStorage.setItem('dinoHighScore', score.toString())
            }
        }
    }, [score, highScore])

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case KEY_CODES.SPACE:
                case KEY_CODES.ARROW_UP:
                    e.preventDefault()
                    if (gameState === 'waiting' || gameState === 'gameOver') {
                        startGame()
                    } else {
                        jump()
                    }
                    break
                case KEY_CODES.ARROW_DOWN:
                    e.preventDefault()
                    duck(true)
                    break
            }
        }

        const handleKeyUp = (e) => {
            if (e.code === KEY_CODES.ARROW_DOWN) {
                duck(false)
            }
        }

        const handleClick = () => {
            if (gameState === 'waiting' || gameState === 'gameOver') {
                startGame()
            } else {
                jump()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        window.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            window.removeEventListener('click', handleClick)
        }
    }, [gameState, jump, duck, startGame])

    useEffect(() => {
        if (gameState !== 'playing') return

        gameLoopRef.current = setInterval(() => {
            setTRex(prev => {
                if (prev.jumping) {
                    const newJumpHeight = prev.jumpHeight + prev.jumpVelocity
                    const newJumpVelocity = prev.jumpVelocity - GAME_CONFIG.GRAVITY
                    
                    if (newJumpHeight <= 0) {
                        return {
                            ...prev,
                            jumping: false,
                            jumpHeight: 0,
                            jumpVelocity: 0
                        }
                    }
                    
                    return {
                        ...prev,
                        jumpHeight: newJumpHeight,
                        jumpVelocity: newJumpVelocity
                    }
                }
                return prev
            })

            setObstacles(prevObstacles => {
                const currentTime = Date.now()
                let newObstacles = prevObstacles
                    .map(obstacle => ({
                        ...obstacle,
                        x: obstacle.x - gameSpeed
                    }))
                    .filter(obstacle => obstacle.x > -50)

                if (currentTime - lastObstacleRef.current > 
                    GAME_CONFIG.OBSTACLE_MIN_GAP + Math.random() * 1000) {
                    const type = OBSTACLE_TYPES[
                        Math.floor(Math.random() * OBSTACLE_TYPES.length)
                    ]
                    
                    newObstacles.push({
                        id: currentTime,
                        x: GAME_CONFIG.CANVAS_WIDTH,
                        type: type,
                        width: GAME_CONFIG.OBSTACLE_WIDTH,
                        height: GAME_CONFIG.OBSTACLE_HEIGHT
                    })
                    
                    lastObstacleRef.current = currentTime
                }

                return newObstacles
            })

            setScore(prevScore => {
                const newScore = prevScore + 1
                if (newScore % GAME_CONFIG.SCORE_INCREMENT_INTERVAL === 0) {
                    setGameSpeed(prevSpeed => 
                        Math.min(prevSpeed + GAME_CONFIG.SPEED_INCREMENT, GAME_CONFIG.MAX_SPEED)
                    )
                }
                return newScore
            })
        }, 1000 / GAME_CONFIG.FPS)

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current)
            }
        }
    }, [gameState, gameSpeed])

    useEffect(() => {
        if (gameState !== 'playing') return

        const tRexRect = {
            x: 25,
            y: GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - 
               GAME_CONFIG.TREX_HEIGHT - tRex.jumpHeight,
            width: GAME_CONFIG.TREX_WIDTH,
            height: tRex.ducking ? 26 : GAME_CONFIG.TREX_HEIGHT
        }

        const collision = obstacles.some(obstacle => {
            if (obstacle.type === 'pass1' && tRex.ducking) return false
            if (obstacle.type === 'pass' && tRex.jumping) return false

            const obstacleBottom = obstacle.type === 'pass1' 
                ? GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - 30 - obstacle.height
                : GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_HEIGHT - obstacle.height
                
            const obstacleRect = {
                x: obstacle.x,
                y: obstacleBottom,
                width: obstacle.width,
                height: obstacle.height
            }

            return (
                tRexRect.x < obstacleRect.x + obstacleRect.width - 4 &&
                tRexRect.x + tRexRect.width - 4 > obstacleRect.x &&
                tRexRect.y < obstacleRect.y + obstacleRect.height - 4 &&
                tRexRect.y + tRexRect.height - 4 > obstacleRect.y
            )
        })

        if (collision) {
            gameOver()
        }
    }, [obstacles, tRex, gameState, gameOver])

    return {
        gameState,
        score,
        highScore,
        tRex,
        obstacles,
        startGame
    }
}

function DinoGame() {
    const { gameState, score, highScore, tRex, obstacles, startGame } = useGame()

    return (
        <GameContainer>
            <GameCanvas>
                <ScoreDisplay>
                    <span className="current-score">
                        {score.toString().padStart(5, '0')}
                    </span>
                    <span className="high-score">
                        {highScore.toString().padStart(5, '0')}
                    </span>
                </ScoreDisplay>

                <TRex 
                    isRunning={gameState === 'playing' && !tRex.jumping && !tRex.ducking} 
                    isJumping={tRex.jumping}
                    isDucking={tRex.ducking} 
                    jumpHeight={tRex.jumpHeight} 
                />

                {obstacles.map(obstacle => (
                    <Obstacle 
                        key={obstacle.id} 
                        x={obstacle.x} 
                        type={obstacle.type} 
                        width={obstacle.width} 
                        height={obstacle.height} 
                    />
                ))}

                <Ground isMoving={gameState === 'playing'} />

                {gameState === 'gameOver' && <RestartButton onClick={startGame} />}
                {gameState === 'waiting' && <StartButton onClick={startGame} />}
            </GameCanvas>
        </GameContainer>
    )
}

export default DinoGame
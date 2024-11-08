'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Camera, Lightbulb, RotateCcw, Save, Timer, Volume2 } from "lucide-react"
import confetti from 'canvas-confetti'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Tile {
  id: number
  currentPos: number
  isCorrect?: boolean
}

interface PuzzleImage {
  url: string
  difficulty: number
}

const initialImages: PuzzleImage[] = [
  { url: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=800&q=80", difficulty: 3 },
  { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80", difficulty: 4 },
  { url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80", difficulty: 5 },
]

export function SlidingPuzzle() {
  const [boardSize, setBoardSize] = useState(3)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [emptyTileIndex, setEmptyTileIndex] = useState(8)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [customImage, setCustomImage] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<PuzzleImage>(initialImages[0])
  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const moveAudioRef = useRef(new Audio('/move.mp3'))
  const winAudioRef = useRef(new Audio('/win.mp3'))
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    initializeBoard()
  }, [boardSize, customImage, selectedImage])

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying])

  const initializeBoard = () => {
    const newTiles: Tile[] = []
    const totalTiles = boardSize * boardSize
    
    for (let i = 0; i < totalTiles - 1; i++) {
      newTiles.push({
        id: i,
        currentPos: i,
      })
    }
    setTiles(newTiles)
    setEmptyTileIndex(totalTiles - 1)
    setMoves(0)
    setTime(0)
    setIsPlaying(true)
    setShowVictoryModal(false)
    setGameStarted(true)
  }

  const handleTileClick = (clickedIndex: number) => {
    if (!isMovable(clickedIndex)) return

    if (!isMuted) {
      moveAudioRef.current.currentTime = 0
      moveAudioRef.current.play()
    }

    const newTiles = [...tiles]
    const clickedTile = newTiles.find(tile => tile.currentPos === clickedIndex)
    if (clickedTile) {
      clickedTile.currentPos = emptyTileIndex
      setEmptyTileIndex(clickedIndex)
      setTiles(newTiles)
      setMoves(prev => prev + 1)
      
      if (checkWin(newTiles)) {
        handleWin()
      }
    }
  }

  const isMovable = (index: number) => {
    const row = Math.floor(index / boardSize)
    const col = index % boardSize
    const emptyRow = Math.floor(emptyTileIndex / boardSize)
    const emptyCol = emptyTileIndex % boardSize
    
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    )
  }

  const checkWin = (currentTiles: Tile[]) => {
    return currentTiles.every(tile => tile.currentPos === tile.id)
  }

  const handleWin = () => {
    setIsPlaying(false)
    setGameStarted(false)
    if (!isMuted) {
      winAudioRef.current.play()
    }
    setShowVictoryModal(true)
    triggerWinAnimation()
  }

  const triggerWinAnimation = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        let frame = 0
        const animate = () => {
          frame++
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
          ctx.fillStyle = `hsl(${frame % 360}, 100%, 50%)`
          ctx.font = '30px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('You Win!', canvasRef.current!.width / 2, canvasRef.current!.height / 2)
          if (frame < 180) {
            requestAnimationFrame(animate)
          }
        }
        animate()
      }
    }
  }

  const shuffle = () => {
    const newTiles = [...tiles]
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = newTiles[i].currentPos
      newTiles[i].currentPos = newTiles[j].currentPos
      newTiles[j].currentPos = temp
    }
    setTiles(newTiles)
    setIsPlaying(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (ctx) {
            const size = Math.min(img.width, img.height)
            canvas.width = size
            canvas.height = size
            ctx.drawImage(
              img,
              (img.width - size) / 2,
              (img.height - size) / 2,
              size,
              size,
              0,
              0,
              size,
              size
            )
            setCustomImage(canvas.toDataURL())
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const saveGame = () => {
    const gameState = {
      tiles,
      emptyTileIndex,
      moves,
      time,
      boardSize,
      customImage,
      selectedImage
    }
    localStorage.setItem('puzzleGameState', JSON.stringify(gameState))
    toast({
      title: "Game Saved",
      description: "Your progress has been saved successfully!"
    })
  }

  const loadGame = () => {
    const savedState = localStorage.getItem('puzzleGameState')
    if (savedState) {
      try {
        const { tiles, emptyTileIndex, moves, time, boardSize, customImage, selectedImage } = JSON.parse(savedState)
        setTiles(tiles)
        setEmptyTileIndex(emptyTileIndex)
        setMoves(moves)
        setTime(time)
        setBoardSize(boardSize)
        setCustomImage(customImage)
        setSelectedImage(selectedImage)
        setIsPlaying(true)
        toast({
          title: "Game Loaded",
          description: "Your saved game has been loaded successfully!"
        })
      } catch (error) {
        console.error("Error loading game:", error)
        toast({
          title: "Error",
          description: "Failed to load the saved game. Starting a new game.",
          variant: "destructive"
        })
        initializeBoard()
      }
    } else {
      toast({
        title: "No Saved Game",
        description: "No saved game found. Starting a new game.",
        variant: "destructive"
      })
      initializeBoard()
    }
  }

  const showHint = () => {
    const hintTiles = tiles.map(tile => ({
      ...tile,
      isCorrect: tile.currentPos === tile.id
    }))
    setTiles(hintTiles)
    setTimeout(() => {
      setTiles(tiles.map(tile => ({ ...tile, isCorrect: undefined })))
    }, 2000)
  }

  const handleImageSelect = (image: PuzzleImage) => {
    setSelectedImage(image)
    setBoardSize(image.difficulty)
    setCustomImage(null)
  }

  const getImageUrl = () => {
    return customImage || selectedImage.url
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary">Sliding Puzzle</h1>
        <p className="text-center text-muted-foreground">Arrange the tiles in order to complete the puzzle!</p>
        
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span className="text-lg font-mono">{formatTime(time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">Moves: {moves}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
          >
            <Volume2 className={`w-5 h-5 ${isMuted ? 'opacity-50' : ''}`} />
          </Button>
        </div>

        <div className="relative aspect-square">
          <div
            className="grid gap-1 h-full"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`
            }}
          >
            {Array.from({ length: boardSize * boardSize }).map((_, index) => {
              const tile = tiles.find(t => t.currentPos === index)
              return (
                <div
                  key={index}
                  className={`relative ${
                    index === emptyTileIndex
                      ? 'bg-gray-800'
                      : 'bg-gray-700 cursor-pointer hover:brightness-110'
                  } transition-all duration-300 rounded-md overflow-hidden ${
                    tile?.isCorrect ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => handleTileClick(index)}
                >
                  {tile && (
                    <>
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${getImageUrl()})`,
                          backgroundSize: `${boardSize * 100}%`,
                          backgroundPosition: `${(tile.id % boardSize) / (boardSize - 1) * 100}% ${Math.floor(tile.id / boardSize) / (boardSize - 1) * 100}%`
                        }}
                      />
                      <div className={`absolute inset-0 flex items-center justify-center ${tile.isCorrect ? 'bg-green-500 bg-opacity-50' : ''} transition-all duration-300`}>
                        <span className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 text-sm font-bold bg-black bg-opacity-50 text-white rounded-full">
                          {tile.id + 1}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {gameStarted && (
            <Button onClick={() => {
              setGameStarted(false)
              initializeBoard()
            }} className="bg-green-500 hover:bg-green-600">
              New Game
            </Button>
          )}
          <Button onClick={shuffle} className="bg-blue-500 hover:bg-blue-600">
            <RotateCcw className="w-4 h-4 mr-2" />
            Shuffle
          </Button>
          <Button onClick={showHint} className="bg-yellow-500 hover:bg-yellow-600">
            <Lightbulb className="w-4 h-4 mr-2" />
            Hint
          </Button>
          <Button onClick={saveGame} className="bg-purple-500 hover:bg-purple-600">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={loadGame} className="bg-indigo-500 hover:bg-indigo-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            Load
          </Button>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <label htmlFor="image-upload" className="cursor-pointer">
                <Camera className="w-4 h-4 mr-2" />
                Upload Image
              </label>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Difficulty (Board Size)</label>
          <Slider
            value={[boardSize]}
            min={3}
            max={5}
            step={1}
            onValueChange={([value]) => setBoardSize(value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Select Initial Image</label>
          <div className="flex flex-wrap gap-4">
            {initialImages.map((image, index) => (
              <div
                key={index}
                className={`relative w-24 h-24 rounded-md overflow-hidden cursor-pointer ${
                  selectedImage === image ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleImageSelect(image)}
              >
                <img src={image.url} alt={`Puzzle ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">
                  {image.difficulty}x{image.difficulty}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={showVictoryModal} onOpenChange={setShowVictoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Congratulations! 🎉</DialogTitle>
            <DialogDescription>
              You solved the puzzle in {moves} moves and {formatTime(time)}!
            </DialogDescription>
          </DialogHeader>
          <canvas ref={canvasRef} width="300" height="150" className="mx-auto" />
          <Button onClick={initializeBoard} className="w-full mt-4 bg-green-500 hover:bg-green-600">
            Start New Game
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
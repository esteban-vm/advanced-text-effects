import Particle from '@/Particle'

export default class Effect {
  public context: CanvasRenderingContext2D
  public canvasWidth!: number
  public canvasHeight!: number
  private textX!: number
  private textY!: number
  private maxTextWidth!: number
  private fontSize: number
  private lineHeight: number
  private particles: Particle[]
  public gap: number
  public mouse: { radius: number; x: number; y: number }
  public textInput: HTMLInputElement

  constructor(context: CanvasRenderingContext2D, ...args: [canvasWidth: number, canvasHeight: number]) {
    this.context = context
    this.setSize(...args)
    this.fontSize = 130
    this.lineHeight = this.fontSize * 0.9
    this.particles = []
    this.gap = 2
    this.mouse = { radius: 20_000, x: 0, y: 0 }
    this.textInput = document.querySelector('input') as HTMLInputElement
    this.handleTextInput()
    this.handleMouseMove()
  }

  public wrapText(...args: [text: string]) {
    const gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight)
    gradient.addColorStop(0.3, 'red')
    gradient.addColorStop(0.5, 'magenta')
    gradient.addColorStop(0.7, 'yellow')
    this.context.fillStyle = gradient
    this.context.textAlign = 'center'
    this.context.textBaseline = 'middle'
    this.context.lineWidth = 3
    this.context.strokeStyle = 'orange'
    this.context.font = `${this.fontSize}px Bangers`
    this.breakMultilineText(...args)
    this.convertToParticles()
  }

  private breakMultilineText(text: string) {
    const lines: string[] = []
    const words = text.split(' ')
    let lineCounter = 0
    let line = ''
    for (const word of words) {
      const testLine = line + word + ' '
      if (this.context.measureText(testLine).width > this.maxTextWidth) {
        line = word + ' '
        lineCounter++
      } else {
        line = testLine
      }
      lines[lineCounter] = line
    }
    const textHeight = this.lineHeight * lineCounter
    this.textY = this.canvasHeight / 2 - textHeight / 2
    for (let index = 0; index < lines.length; index++) {
      const args = [lines[index], this.textX, this.textY + index * this.lineHeight] as const
      this.context.fillText(...args)
      this.context.strokeText(...args)
    }
  }

  private handleTextInput() {
    this.textInput.addEventListener('keyup', (event) => {
      if (event.code !== 'Space') {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.wrapText(this.textInput.value.trim())
      }
    })
  }

  private handleMouseMove() {
    window.addEventListener('pointermove', (event) => {
      this.mouse.x = event.x
      this.mouse.y = event.y
    })
  }

  private convertToParticles() {
    this.particles = []
    const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    for (let y = 0; y < this.canvasHeight; y += this.gap) {
      for (let x = 0; x < this.canvasWidth; x += this.gap) {
        const index = (y * this.canvasWidth + x) * 4
        const alpha = pixels[index + 3]
        if (alpha > 0) {
          const { [index]: red, [index + 1]: green, [index + 2]: blue } = pixels
          const color = `rgb(${red}, ${green}, ${blue})`
          this.particles.push(new Particle(this, x, y, color))
        }
      }
    }
  }

  public render() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    for (const particle of this.particles) {
      particle.update()
      particle.draw()
    }
  }

  public setSize(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.textX = this.canvasWidth / 2
    this.textY = this.canvasHeight / 2
    this.maxTextWidth = this.canvasWidth * 0.7
  }
}

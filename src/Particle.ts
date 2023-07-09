import type Effect from '@/Effect'

export default class Particle {
  private effect: Effect
  private x: number
  private y: number
  private originX: number
  private originY: number
  private dx: number
  private dy: number
  private vx: number
  private vy: number
  private color: string
  private size: number
  private force: number
  private angle: number
  private distance: number
  private friction: number
  private ease: number

  constructor(effect: Effect, x: number, y: number, color: string) {
    this.effect = effect
    this.x = Math.random() * this.effect.canvasWidth
    this.y = 0
    this.originX = x
    this.originY = y
    this.dx = 0
    this.dy = 0
    this.vx = 0
    this.vy = 0
    this.color = color
    this.size = this.effect.gap
    this.force = 0
    this.angle = 0
    this.distance = 0
    this.friction = Math.random() * 0.6 + 0.15
    this.ease = Math.random() * 0.1 + 0.005
  }

  public draw() {
    this.effect.context.fillStyle = this.color
    this.effect.context.fillRect(this.x, this.y, this.size, this.size)
  }

  public update() {
    const { x: mouseX, y: mouseY, radius } = this.effect.mouse
    this.dx = mouseX - this.x
    this.dy = mouseY - this.y
    this.distance = this.dx ** 2 + this.dy ** 2
    this.force = -radius / this.distance
    if (this.distance < radius) {
      this.angle = Math.atan2(this.dy, this.dx)
      this.vx += this.force * Math.cos(this.angle)
      this.vy += this.force * Math.sin(this.angle)
    }
    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease
    this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease
  }
}

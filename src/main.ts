import '@/style.css'
import Effect from '@/Effect'

window.addEventListener('load', function () {
  const app = document.getElementById('app') as HTMLCanvasElement
  app.width = this.innerWidth
  app.height = this.innerHeight

  const context = app.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
  const effect = new Effect(context, app.width, app.height)
  effect.wrapText('Hello! How are you?')
  effect.render()

  const animate = () => {
    effect.render()
    this.requestAnimationFrame(animate)
  }

  animate()

  this.addEventListener('resize', () => {
    app.width = this.innerWidth
    app.height = this.innerHeight
    effect.setSize(app.width, app.height)
    effect.wrapText(effect.textInput.value)
  })
})

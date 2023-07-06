import '@/style.css'
import Effect from '@/Effect'

window.addEventListener('load', function () {
  const app = document.getElementById('app') as HTMLCanvasElement
  app.width = this.innerWidth
  app.height = this.innerHeight

  const context = app.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
  const effect = new Effect(context, app.width, app.height)
  effect.wrapText('Hello how are you')
  effect.render()

  const animate = () => {
    context.clearRect(0, 0, app.width, app.height)
    effect.render()
    requestAnimationFrame(animate)
  }

  animate()

  this.addEventListener('resize', () => {
    app.width = this.innerWidth
    app.height = this.innerHeight
    effect.resize(app.width, app.height)
    effect.wrapText(effect.textInput.value)
  })
})

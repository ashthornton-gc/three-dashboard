import '../sass/style.scss'
import Dashboard from './components/Dashboard'

// Initial HMR Setup
if (module.hot) {
    module.hot.accept()

    module.hot.dispose(() => {
        document.querySelector('canvas').remove()
        window.Dashboard.renderer.forceContextLoss()
        window.Dashboard.renderer.context = null
        window.Dashboard.renderer.domElement = null
        window.Dashboard.renderer = null
        cancelAnimationFrame(window.Dashboard.animationId)
        removeEventListener('resize', window.Dashboard.resize)
        removeEventListener('mousemove', window.Dashboard.mousemove)
    })
}

// window.addEventListener('load', () => {
    window.Dashboard = new Dashboard()
// })
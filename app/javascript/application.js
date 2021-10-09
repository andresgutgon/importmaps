// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"

const outClass = '-translate-x-full'
async function animateInOrOut(element, timing, easing, transform) {
  element.classList.add(timing, easing, transform);
  return Promise.all(element.getAnimations().map((animation) => animation.finished))
}

// Run this before render, but after click.
// Use await for the function, then a promise to ensure it's finished before resume
document.addEventListener("turbo:before-render", async (event) => {
  event.preventDefault()

  const main = document.querySelector(".js-main")
  await animateInOrOut(main, 'duration-150', 'ease-in' , outClass)

  const newMain = event.detail.newBody.getElementsByClassName('js-main')[0]
  await animateInOrOut(newMain, 'duration-300', 'ease-out' , 'translate-x-full')
  event.detail.resume()
})

document.addEventListener("turbo:before-cache", async (event) => {
  const href = window.location.href
  const cache = window.Turbo.session.view.snapshotCache.snapshots[href]
  if (!cache) return

  const cachedMain = cache.element.getElementsByClassName('js-main')[0]
  if (!cachedMain) return

  cachedMain.classList.remove(outClass)
})

/**
 * Very important here about CSS animations/transitions
 * To make transition work, three things have to happen.
 *
 * 1. The element has to have the property explicitly defined, in this case: transform: translateX(-100%); // Off the page
 * 2. The element must have the transition defined: transition-property: transform;
 * 3. The new property must be set: transform: translateX(-100%) // Back visible to the page
 *
 * If you are assigning 1 and 2 dynamically, there needs to be a delay before 3 so the browser can process the request.
 * The reason it works when you are debugging in a browser like Chrome Dev tools it is that you are creating this delay by stepping through it,
 * giving the browser time to process.
 */
document.addEventListener("turbo:render", async (event) => {
  const main = document.querySelector(".js-main")
  window.setTimeout(function() {
    main.classList.remove('translate-x-full');
  }, 1) // 1 millisecond delay is enough
})

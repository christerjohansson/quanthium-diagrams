anime.speed = 1

let burstOpts = {
  colors: ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'],
  radius: 50,
  amount: 10,
  zIndex: 1
}

function burst (x, y, radius) {
  let size = (radius + 8) * 2
  let root = $mm.createSvg('svg', {
    viewBox: `${-size/2} ${-size/2} ${size} ${size}`,
    width: size,
    height: size,
    style: `transform: translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0); position: absolute; left:0; top:0; z-index: ${burstOpts.zIndex}; pointer-events: none`
  })
  
  let circle = $mm.createSvg('circle', {
    cx: 0,
    cy: 0,
    r: 0,
    opacity: 1,
    fill: 'none',
    stroke: '#FFF',
    'stroke-width': 2
  })
  
  let particules = $mm.array(burstOpts.amount, () => {
    let part = $mm.createSvg('circle', {
      cx: 0,
      cy: 0,
      r: 16,
      fill: $mm.randArr(burstOpts.colors)
    })
    
    let theta = anime.random(0, 360) * Math.PI/180
    let r = anime.random(Math.max(0, radius*3/4), radius)
    
    part.endPos = {
      x: r * Math.cos(theta),
      y: r * Math.sin(theta)
    }

    return part
  })
  
  root.append(circle)
  particules.forEach(el => root.append(el))
  $mm('body').append(root)
  
  anime.timeline()
    .add({
      targets: particules,
      cx: p => p.endPos.x,
      cy: p => p.endPos.y,
      duration: 800,
      r: 0,
      easing: 'easeOutQuart'
    })
    .add({
      targets: circle,
      r: radius,
      opacity: 0,
      duration: 400,
      easing: 'easeOutQuad',
      offset: 0
    })
    .finished.then(() => root.remove())
  
  return root
}

$mm(document).on('click', e => {
  burst(e.pageX || e.touches[0].pageX, e.pageY || e.touches[0].pageY, burstOpts.radius)
}, { passive: false })
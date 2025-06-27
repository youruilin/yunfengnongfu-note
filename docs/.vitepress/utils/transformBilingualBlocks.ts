// export function transformBilingualBlocks() {
//   const regex = /【([^|【】]+)\|([^|【】]+)】/g
//   const contentBlocks = document.querySelectorAll('.VPDoc div, .VPDoc p, .VPDoc li')

//   contentBlocks.forEach(block => {
//     if (!block.innerHTML.includes('【') || !regex.test(block.innerHTML)) return

//     block.innerHTML = block.innerHTML.replace(regex, (_, zh, en) => {
//       const id = 'en_' + Math.random().toString(36).substring(2, 8)
//       return `
//         <p class="zh" onclick="document.getElementById('${id}').classList.toggle('hidden')">${zh}</p>
//         <p class="en hidden" id="${id}">${en}</p>
//       `
//     })
//   })
// }

// export function transformBilingualBlocks() {
//   const regex = /【([^|【】]+)\|([^|【】]+)】/g
//   const contentBlocks = document.querySelectorAll('p')

//   contentBlocks.forEach(block => {
//     if (!block.innerHTML.includes('【') || !regex.test(block.innerHTML)) return

//     block.innerHTML = block.innerHTML.replace(regex, (_, zh, en) => {
//       return `
//         <p class="p-zh" onclick="this.nextElementSibling.classList.toggle('hidden')">${zh}</p>
//         <p class="p-en hidden">${en}</p>
//       `
//     })
//   })
// }

export function transformBilingualBlocks() {
  if (typeof document === 'undefined') return // 避免 SSR 构建时报错

  const regex = /【([^|【】]+)\|([^|【】]+)】/g
  const contentBlocks = document.querySelectorAll('p')

  contentBlocks.forEach(block => {
    if (!block.innerHTML.includes('【') || !regex.test(block.innerHTML)) return

    block.innerHTML = block.innerHTML.replace(regex, (_, zh, en) => {
      return `
        <p class="p-zh" onclick="this.nextElementSibling.classList.toggle('hidden')">${zh}</p>
        <p class="p-en hidden">${en}</p>
      `
    })
  })
}


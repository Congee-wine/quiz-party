/**
 * 使用 Fisher-Yates 算法打乱数组
 * @param array - 要打乱的数组
 * @returns 打乱后的数组
 */
function shuffleArray<T>(array: T[]): T[] {
  let curId = array.length

  while (curId) {
    let randId = Math.floor(Math.random() * curId)
    curId -= 1

    let tmp = array[curId]

    array[curId] = array[randId]
    array[randId] = tmp
  }

  return array
}

export default shuffleArray

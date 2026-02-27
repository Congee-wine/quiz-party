/// <reference types="vite/client" />

// 声明 .vue 文件的模块类型
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明 .scss 文件的模块类型
declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

// 声明图片文件的模块类型
declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

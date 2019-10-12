const fs = require('fs')
const path = require('path')
//从tsconfig.json 文件中继承所有的编译器选项和文件列表
const ts = require('rollup-plugin-typescript2')
//打包时动态替换代码中的内容
const replace = require('rollup-plugin-replace')
// 为模块起别名
const alias = require('rollup-plugin-alias')
//支持导入json模块
const json = require('rollup-plugin-json')

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const name = path.basename(packageDir)
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}

// build aliases dynamically
const aliasOptions = { resolve: ['.ts'] }
fs.readdirSync(packagesDir).forEach(dir => {
  if (dir === 'vue') {
    return
  }
  if (fs.statSync(path.resolve(packagesDir, dir)).isDirectory()) {
    aliasOptions[`@vue/${dir}`] = path.resolve(packagesDir, `${dir}/src/index`)
  }
})
const aliasPlugin = alias(aliasOptions)

// ensure TS checks only once for each build
let hasTSChecked = false

const configs = {
  esm: {
    file: resolve(`dist/${name}.esm-bundler.js`), //要写入的文件
    format: `es` //生成包的格式 es 为将软件包保存为ES模块文件
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs` // commonJS,适应于Node 和 Browserify/Webpack
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife` // 一个自动执行的功能， 适合作为<script>标签
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  }
}

const defaultFormats = ['esm', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(configs[format]))

// 为生产环境时打包选项，暂时忽略
if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach(format => {
    if (format === 'cjs') {
      packageConfigs.push(createProductionConfig(format))
    }
    if (format === 'global' || format === 'esm-browser') {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}

module.exports = packageConfigs

function createConfig(output, plugins = []) {
  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
  const isGlobalBuild = /\.global(\.prod)?\.js$/.test(output.file)
  const isBundlerESMBuild = /\.esm\.js$/.test(output.file)
  const isBrowserESMBuild = /esm-browser(\.prod)?\.js$/.test(output.file)

  if (isGlobalBuild) {
    output.name = packageOptions.name
  }

  const shouldEmitDeclarations =
    process.env.TYPES != null &&
    process.env.NODE_ENV === 'production' &&
    !hasTSChecked

  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      },
      exclude: ['**/__tests__']
    }
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const externals = Object.keys(aliasOptions).filter(p => p !== '@vue/shared')

  return {
    //包入口
    input: resolve(`src/index.ts`),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    // 外链
    external: isGlobalBuild || isBrowserESMBuild ? [] : externals,
    // 插件
    plugins: [
      json({
        namedExports: false
      }),
      tsPlugin,
      aliasPlugin,
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild,
        (isGlobalBuild || isBrowserESMBuild) &&
          !packageOptions.enableNonBrowserBranches
      ),
      ...plugins
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }
}

function createReplacePlugin(isProduction, isBundlerESMBuild, isBrowserBuild) {
  return replace({
    __COMMIT__: `"${process.env.COMMIT}"`,
    __DEV__: isBundlerESMBuild
      ? // preserve to be handled by bundlers
        `process.env.NODE_ENV !== 'production'`
      : // hard coded dev/prod builds
        !isProduction,
    // If the build is expected to run directly in the browser (global / esm-browser builds)
    __BROWSER__: isBrowserBuild,
    // support options?
    // the lean build drops options related code with buildOptions.lean: true
    __FEATURE_OPTIONS__: !packageOptions.lean,
    __FEATURE_SUSPENSE__: true,
    // this is only used during tests
    __JSDOM__: false
  })
}

function createProductionConfig(format) {
  return createConfig({
    file: resolve(`dist/${name}.${format}.prod.js`),
    format: configs[format].format
  })
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser')
  return createConfig(
    {
      file: resolve(`dist/${name}.${format}.prod.js`),
      format: configs[format].format
    },
    [
      terser({
        module: /^esm/.test(format)
      })
    ]
  )
}

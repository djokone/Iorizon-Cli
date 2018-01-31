# Class

## `AliasLoader`

### `constructor()`

### `paths: *`

### `aliasReg: *`

### `parseUrl()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `hasAlias()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `findAlias()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `getPath()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `addPath()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `Io`

### `constructor()`

### `_process: *`

### `_current: *`

### `globalFolder: *`

### `enginePath: *`

### `ioFile: *`

### `commandPriority: *`

### `_enginePath: *`

### `_argv: *`

### `isInit: *`

### `_engine: *`

### `hasModule: *`

### `_processArgv: *`

### `initProperties()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `ioRequire()`

Require proxy to use alias shortcut in require function. Juste run the function to active the proxy.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `init()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `_syncOptions()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `addOptions()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `runSubCommand()`

Run the current sub command

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `parseArgv(argvs: [Array]): [Object]`

Parse node js process.argv array to an object

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| argvs | [Array] |  | [Process argv array to parse] |

### `isEngineProcess(pathTo: String): Boolean`

Test if a specifique path is come from the engine

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| pathTo | String |  | Path you want to check |

### `pathToIoFile(pathTo: [type]): Boolean`

Get the path to a Io root file from a given folder. This function will search in all the parents folder to return the first file it find.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| pathTo | [type] |  | The path where you want to start the research |

## `IoLoader`

### `constructor()`

### `ioConf: *`

### `isGlobal: *`

### `Loaders: *`

### `_child: *`

### `_options: *`

### `alias: *`

### `modules: *`

### `absolutePathReg()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `runModule()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `Loader`

### `constructor()`

### `allowedExt: *`

### `reloaded: *`

### `ioFileName: *`

### `isLoaded: *`

### `isFileLoaded: *`

### `_content: *`

### `_reg: *`

### `_defaultPath: *`

### `type: *`

### `url: *`

### `path: *`

### `hasConfigFile()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `each()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `isExtAllowed()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `load()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `download()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `ModuleLoader`

### `constructor()`

### `argv: *`

### `relativeReg: *`

### `alias: *`

### `isLoaded: *`

### `has()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `hasConfFile()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `getModuleOptions()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `getUrl()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `hasUrl()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `buildRequest()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `buildOptions()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `buildCmd()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `buildProcess()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `run()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `OptionsLoader`

### `constructor()`

### `parseOption(optionArg: [type]): [type]`

Parse Option Called trought the ioConfig

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| optionArg | [type] |  | [description] |

### `parseOptionValue(value: [Array|Object|String|Number], isRoot: Boolean): Object`

Parse Option Value In Configuration file

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| value | [Array|Object|String|Number] |  | Value to parse |
| isRoot | Boolean |  | If it's call form inside |

### `getOption()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `get()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `print`

### `constructor()`

## `view`

### `constructor()`

### `_options: *`

### `_view: *`

### `_builder: *`

### `_theme: *`

### `init()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `tableRedemptionTheme()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

### `tableRedemptionInit()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

# Function

## `activeProxy()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `debug()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `mix()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `copyProperties()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `capitalize()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `escape()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `forEach()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |

## `exports()`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
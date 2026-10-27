export type Environment = {
  name: string
  branch: string
}

export type Project = {
  id: string
  repo: {
    owner: string
    name: string
  }
  pluginPaths: string[]
  environments: Environment[]
  createdAt: string
}

export type RepositorySummary = {
  owner: string
  name: string
  fullName: string
  isPrivate: boolean
  defaultBranch: string
  ownerAvatarUrl: string
}

export type PluginFolder = {
  path: string
  pluginCount: number
}

export type ComposerSetup = {
  hasLock: boolean
  isValid: boolean
  pluginPackageCount: number
  installerPath: string | null
}

export type RepositorySetup = {
  branch: string
  pluginFolders: PluginFolder[]
  composer: ComposerSetup | null
  branches: string[]
}

export type GitHubUser = {
  login: string
  name: string
  avatarUrl: string
}

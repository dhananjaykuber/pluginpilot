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

export type GitHubUser = {
  login: string
  name: string
  avatarUrl: string
}

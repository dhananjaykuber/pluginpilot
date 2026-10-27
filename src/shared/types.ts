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
  localPath?: string
  createdAt: string
}

export type GitHubUser = {
  login: string
  name: string
  avatarUrl: string
}

export type DeviceCodePrompt = {
  userCode: string
  verificationUri: string
  expiresAt: string
}

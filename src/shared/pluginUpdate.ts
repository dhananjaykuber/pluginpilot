export function getUpdateBranchName(slug: string, version: string): string {
  return `plugin-update/${slug}-${version}`
}

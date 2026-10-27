import { DownloadIcon, Loader2Icon, UploadIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useExportProjects, useImportProjects } from '@/hooks/useProjectTransfer'
import { getErrorMessage } from '@/lib/errors'
import { pluralize } from '@/lib/format'

export function ProjectsBackupCard(): React.JSX.Element {
  const exportProjects = useExportProjects()
  const importProjects = useImportProjects()

  function handleExport(): void {
    exportProjects.mutate(undefined, {
      onSuccess: (result) =>
        result && toast.success(`Exported ${pluralize(result.count, 'project')}`),
      onError: (error) => toast.error(getErrorMessage(error))
    })
  }

  function handleImport(): void {
    importProjects.mutate(undefined, {
      onSuccess: (result) => result && toast.success(describeImport(result)),
      onError: (error) => toast.error(getErrorMessage(error))
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects backup</CardTitle>
        <CardDescription>
          Save your projects to a file to restore them later, move to another Mac or share them with
          a teammate. The file only contains repositories, plugin folders and environments, never
          your GitHub token or Wordfence key.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button variant="outline" onClick={handleExport} disabled={exportProjects.isPending}>
          {exportProjects.isPending ? (
            <Loader2Icon data-icon="inline-start" className="animate-spin" />
          ) : (
            <DownloadIcon data-icon="inline-start" />
          )}
          Export projects
        </Button>
        <Button variant="outline" onClick={handleImport} disabled={importProjects.isPending}>
          {importProjects.isPending ? (
            <Loader2Icon data-icon="inline-start" className="animate-spin" />
          ) : (
            <UploadIcon data-icon="inline-start" />
          )}
          Import projects
        </Button>
      </CardContent>
    </Card>
  )
}

function describeImport({ imported, skipped }: { imported: number; skipped: number }): string {
  const importedText = `Imported ${pluralize(imported, 'project')}`

  return skipped > 0 ? `${importedText}, skipped ${skipped} already added` : importedText
}

import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useSetBackgroundChecks, useSettings } from '@/hooks/useSettings'
import { getErrorMessage } from '@/lib/errors'

export function BackgroundChecksCard(): React.JSX.Element {
  const { data: settings } = useSettings()
  const setBackgroundChecks = useSetBackgroundChecks()

  function handleChange(enabled: boolean): void {
    setBackgroundChecks.mutate(enabled, {
      onError: (error) => toast.error(getErrorMessage(error))
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background checks</CardTitle>
        <CardDescription>
          While PluginPilot is open, every project is scanned every 6 hours. You get a macOS
          notification for each new critical vulnerability, and the Dock icon shows how many are
          open. Needs a Wordfence API key for the vulnerability part.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Label>
          <Checkbox
            checked={settings?.backgroundChecks ?? false}
            onCheckedChange={handleChange}
            disabled={!settings || setBackgroundChecks.isPending}
          />
          Check all projects every 6 hours
        </Label>
      </CardContent>
    </Card>
  )
}

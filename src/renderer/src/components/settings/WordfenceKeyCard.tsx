import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink } from '@/components/common/ExternalLink'
import { useSettings } from '@/hooks/useSettings'
import { WordfenceKeyForm } from './WordfenceKeyForm'
import { WordfenceKeySaved } from './WordfenceKeySaved'

const WORDFENCE_ACCOUNT_URL = 'https://www.wordfence.com/'

export function WordfenceKeyCard(): React.JSX.Element {
  const { data: settings } = useSettings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vulnerability data</CardTitle>
        <CardDescription>
          Known vulnerabilities come from the free Wordfence Intelligence feed. Create an API key in
          your <ExternalLink href={WORDFENCE_ACCOUNT_URL}>Wordfence account</ExternalLink> under
          Account → Integrations. The key is encrypted and stored only on this machine.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!settings && <Skeleton className="h-8 w-full" />}
        {settings?.hasWordfenceKey && <WordfenceKeySaved />}
        {settings && !settings.hasWordfenceKey && <WordfenceKeyForm />}
      </CardContent>
    </Card>
  )
}

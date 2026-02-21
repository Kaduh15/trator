import { useForm } from '@tanstack/react-form'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { env } from '@trator/env/web'
import { ChevronLeftIcon, PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ButtonLogout } from '@/components/button-logout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { queryClient } from '@/providers/query-provider'

interface Client {
  id: string
  name: string
  phone?: string
}

interface Service {
  clientId: string
  createdAt: Date
  description: string
  id: string
}

const getClientQueryOptions = queryOptions({
  queryKey: ['clients'],
  queryFn: async () => {
    const response = await fetch(`${env.VITE_SERVER_URL}/api/clients`, {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch clients')
    }

    const data = (await response.json()) as Client[]

    return data
  },
})

export const Route = createFileRoute('/(private)/trator/servico/novo')({
  component: RouteComponent,
  beforeLoad: async () => {
    await queryClient.ensureQueryData(getClientQueryOptions)
  },
})

function RouteComponent() {
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const { data: clientsData } = useSuspenseQuery(getClientQueryOptions)

  const [clients, setClients] = useState<Client[]>(clientsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreatingClient, setIsCreatingClient] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newClientError, setNewClientError] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const [submitMessage, setSubmitMessage] = useState('')

  const form = useForm({
    defaultValues: {
      description: '',
    },
    onSubmit: ({ value }) => {
      if (!selectedClient || value.description.trim().length === 0) {
        return
      }

      const service: Service = {
        id: crypto.randomUUID(),
        clientId: selectedClient.id,
        description: value.description.trim(),
        createdAt: new Date(),
      }

      setServices((prevServices) => [service, ...prevServices])
      form.setFieldValue('description', '')
      setSubmitMessage('Servico criado com sucesso.')

      window.setTimeout(() => {
        setSubmitMessage('')
      }, 2500)
    },
  })

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return clients
    }

    return clients.filter((client) =>
      client.name.toLowerCase().includes(normalizedSearch)
    )
  }, [clients, searchTerm])

  useEffect(() => {
    if (!isModalOpen) {
      return
    }

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [isModalOpen])

  const isCreateServiceDisabled =
    !selectedClient || form.state.values.description.trim().length === 0

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(false)
    setSearchTerm('')
    setIsCreatingClient(false)
    setNewClientName('')
    setNewClientPhone('')
    setNewClientError('')
  }

  const handleCreateClient = () => {
    if (newClientName.trim().length === 0) {
      setNewClientError('O nome do cliente e obrigatório.')
      return
    }

    const newClient: Client = {
      id: crypto.randomUUID(),
      name: newClientName.trim(),
      phone: newClientPhone.trim() || undefined,
    }

    setClients((prevClients) => [newClient, ...prevClients])
    handleSelectClient(newClient)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            aria-label="Voltar"
            onClick={() => window.history.back()}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">
              Trator
            </p>
            <h1 className="font-semibold text-lg">Novo Servico</h1>
          </div>
        </div>
        <ButtonLogout />
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 py-4 pb-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do servico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Button
                className="w-full justify-start text-left font-normal"
                onClick={() => setIsModalOpen(true)}
                type="button"
                variant="outline"
              >
                {selectedClient?.name ?? 'Selecionar cliente'}
              </Button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                form.handleSubmit()
              }}
            >
              <form.Field name="description">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Descricao do servico</Label>
                    <Textarea
                      id={field.name}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Descreva o servico prestado"
                      rows={5}
                      value={field.state.value}
                    />
                  </div>
                )}
              </form.Field>
            </form>
          </CardContent>
        </Card>

        {submitMessage ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700 text-sm">
            {submitMessage}
          </p>
        ) : null}

        {services.length > 0 ? (
          <p className="text-muted-foreground text-xs">
            Servicos criados: {services.length}
          </p>
        ) : null}

        <Button
          className="w-full"
          disabled={isCreateServiceDisabled}
          onClick={() => form.handleSubmit()}
        >
          Criar servico
        </Button>
      </main>

      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
        <DialogContent className="gap-4">
          <DialogHeader>
            <DialogTitle>Selecionar cliente</DialogTitle>
          </DialogHeader>

          <Command shouldFilter={false}>
            <CommandInput
              onValueChange={setSearchTerm}
              placeholder="Pesquisar cliente..."
              ref={searchInputRef}
              value={searchTerm}
            />
            <CommandList>
              <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
              <CommandGroup heading="Clientes">
                <ScrollArea className="max-h-60">
                  {filteredClients.map((client) => (
                    <CommandItem
                      key={client.id}
                      onSelect={() => handleSelectClient(client)}
                      value={client.name}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {client.name}
                        </span>
                        {client.phone ? (
                          <span className="text-muted-foreground text-xs">
                            {client.phone}
                          </span>
                        ) : null}
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>

          <Separator />

          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => setIsCreatingClient((prev) => !prev)}
              type="button"
              variant="secondary"
            >
              <PlusIcon className="size-4" />
              Adicionar novo cliente
            </Button>

            {isCreatingClient ? (
              <div className="space-y-3 rounded-lg border p-3">
                <div className="space-y-2">
                  <Label htmlFor="new-client-name">Nome do cliente</Label>
                  <Input
                    id="new-client-name"
                    onChange={(event) => {
                      setNewClientName(event.target.value)
                      setNewClientError('')
                    }}
                    placeholder="Nome do cliente"
                    value={newClientName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-client-phone">Telefone (opcional)</Label>
                  <Input
                    id="new-client-phone"
                    onChange={(event) => setNewClientPhone(event.target.value)}
                    placeholder="(00) 00000-0000"
                    value={newClientPhone}
                  />
                </div>
                {newClientError ? (
                  <p className="text-destructive text-sm">{newClientError}</p>
                ) : null}
                <Button className="w-full" onClick={handleCreateClient}>
                  Criar novo cliente
                </Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

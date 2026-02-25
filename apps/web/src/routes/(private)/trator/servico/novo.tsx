import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeftIcon, PlusIcon } from 'lucide-react'
import { Activity, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { Client } from '@/http/queries/client'
import {
  createClientQueryOptions,
  getClientsQueryOptions,
} from '@/http/queries/client'
import { createServiceMutationOptions } from '@/http/queries/service'
import { queryClient } from '@/providers/query-provider'

export const Route = createFileRoute('/(private)/trator/servico/novo')({
  component: RouteComponent,
  beforeLoad: async () => {
    await queryClient.ensureQueryData(getClientsQueryOptions())
  },
})

function RouteComponent() {
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = Route.useNavigate()

  const { data: clients } = useSuspenseQuery(getClientsQueryOptions())

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreatingClient, setIsCreatingClient] = useState(false)

  const formNewClient = useForm({
    defaultValues: {
      name: '',
      phone: '',
    },
  })

  const { mutate: createClient } = useMutation(createClientQueryOptions())

  const { mutate: createService } = useMutation(createServiceMutationOptions())

  const form = useForm({
    defaultValues: {
      description: '',
    },
    onSubmit: ({ value }) => {
      if (!selectedClient || value.description.trim().length === 0) {
        return
      }

      createService(
        {
          description: value.description.trim(),
          clientId: selectedClient.id,
        },
        {
          onSuccess: () =>
            navigate({
              to: '/trator/servicos',
            }),
        }
      )
    },
  })

  const isValidCreateService = useStore(form.store, (state) => {
    return state.isFormValid && selectedClient !== null
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

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(false)
    setSearchTerm('')
    setIsCreatingClient(false)
    formNewClient.resetField('name')
    formNewClient.resetField('phone')
  }

  const handleCreateClient = () => {
    if (formNewClient.state.values.name.trim().length === 0) {
      toast.error('O nome do cliente e obrigatório.')
      return
    }

    const newClient: Client = {
      id: crypto.randomUUID(),
      name: formNewClient.state.values.name.trim(),
      phone: formNewClient.state.values.phone.trim() || undefined,
    }

    handleSelectClient(newClient)
    createClient(newClient)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            aria-label="Voltar"
            onClick={() =>
              navigate({
                to: '/trator/servicos',
              })
            }
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
            <h1 className="font-semibold text-lg">Novo Serviço</h1>
          </div>
        </div>
        <ButtonLogout />
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 py-4 pb-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do serviço</CardTitle>
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
                    <Label htmlFor={field.name}>Descrição do serviço</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Descreva o serviço prestado"
                      rows={5}
                      value={field.state.value}
                    />
                  </div>
                )}
              </form.Field>
            </form>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          disabled={!isValidCreateService}
          onClick={() => form.handleSubmit()}
        >
          Criar serviço
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
                {filteredClients.map((client) => (
                  <CommandItem
                    key={client.id}
                    onSelect={() => handleSelectClient(client)}
                    value={client.name}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{client.name}</span>
                      <Activity mode={client.phone ? 'visible' : 'hidden'}>
                        <span className="text-muted-foreground text-xs">
                          {client.phone}
                        </span>
                      </Activity>
                    </div>
                  </CommandItem>
                ))}
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

            <Activity mode={isCreatingClient ? 'visible' : 'hidden'}>
              <div className="space-y-3 rounded-lg border p-3">
                <formNewClient.Field name="name">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Nome do cliente</Label>
                      <Input
                        id={field.name}
                        onChange={(event) => {
                          field.handleChange(event.target.value)
                        }}
                        placeholder="Nome do cliente"
                        value={field.state.value}
                      />
                    </div>
                  )}
                </formNewClient.Field>
                <formNewClient.Field name="phone">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Telefone (opcional)</Label>
                      <Input
                        id={field.name}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder="(00) 00000-0000"
                        value={field.state.value}
                      />
                    </div>
                  )}
                </formNewClient.Field>
                <Button className="w-full" onClick={handleCreateClient}>
                  Criar novo cliente
                </Button>
              </div>
            </Activity>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

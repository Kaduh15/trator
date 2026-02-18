import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DollarSignIcon,
  LogOutIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/(private)/trator/horas')({
  component: RouteComponent,
})

function RouteComponent() {
  const isFilterMonth = true

  return (
    <div>
      <header className="flex items-center justify-between border-b-2 p-2">
        <h1>Minhas Horas</h1>
        <Button type="button" variant="ghost">
          <LogOutIcon />
        </Button>
      </header>

      <main className="space-y-4 p-4">
        <div className="flex w-full items-center justify-between gap-4 bg-accent px-4 py-2">
          <p>Valor hora atual</p>

          <p>R$ 100,00/h</p>
        </div>

        <ButtonGroup className="flex w-full">
          <Button
            className="flex-1 hover:cursor-pointer"
            variant={isFilterMonth ? 'outline' : 'default'}
          >
            Semana
          </Button>
          <ButtonGroupSeparator />
          <Button
            className="flex-1 hover:cursor-pointer"
            variant={isFilterMonth ? 'default' : 'outline'}
          >
            Mês
          </Button>
        </ButtonGroup>

        <div className="flex w-full items-center justify-around gap-4">
          <Button variant="secondary">
            <ChevronLeftIcon />
          </Button>
          <p>Junho 2024</p>
          <Button variant="secondary">
            <ChevronRightIcon />
          </Button>
        </div>

        <div className="flex justify-between gap-2">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <ClockIcon className="text-primary" />
                Total de Horas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl">6h 30min</p>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <DollarSignIcon className="text-primary" />
                Ganhos Estimados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-primary">R$ 600,00</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <p>Por dia</p>
          <ul className="mt-2 space-y-2">
            <li className="flex items-center justify-between rounded-md">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold text-xs">
                    Ter 17/02
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className='text-base'>2h 30min</p>
                  <p className="text-base text-primary">R$ 250,00</p>
                </CardContent>
              </Card>
            </li>
            <li className="flex items-center justify-between rounded-md">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold text-xs">
                    Qua 18/02
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className='text-base'>2h 30min</p>
                  <p className="text-base text-primary">R$ 250,00</p>
                </CardContent>
              </Card>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

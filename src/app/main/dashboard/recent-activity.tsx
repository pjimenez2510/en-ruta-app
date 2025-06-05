import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "Venta",
      description: "Boleto #12345 - Ambato a Quito",
      amount: "$12.50",
      date: "Hace 5 minutos",
      initials: "MR",
      color: "bg-green-100 text-green-600",
    },
    {
      id: 2,
      type: "Venta",
      description: "Boleto #12346 - Ambato a Guayaquil",
      amount: "$15.00",
      date: "Hace 15 minutos",
      initials: "JL",
      color: "bg-green-100 text-green-600",
    },
    {
      id: 3,
      type: "Reembolso",
      description: "Boleto #12340 - Quito a Cuenca",
      amount: "-$18.75",
      date: "Hace 1 hora",
      initials: "AC",
      color: "bg-red-100 text-red-600",
    },
    {
      id: 4,
      type: "Venta",
      description: "Boleto #12347 - Ambato a Riobamba",
      amount: "$8.25",
      date: "Hace 2 horas",
      initials: "PV",
      color: "bg-green-100 text-green-600",
    },
    {
      id: 5,
      type: "Venta",
      description: "Boleto #12348 - Quito a Loja",
      amount: "$22.00",
      date: "Hace 3 horas",
      initials: "EM",
      color: "bg-green-100 text-green-600",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar className={`h-9 w-9 ${activity.color}`}>
            <AvatarFallback>{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.type}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <p className="text-xs text-muted-foreground">{activity.date}</p>
          </div>
          <div className={`font-medium ${activity.type === "Reembolso" ? "text-red-600" : "text-green-600"}`}>
            {activity.amount}
          </div>
        </div>
      ))}
    </div>
  )
}

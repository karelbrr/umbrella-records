"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { recentActivity } from "./mock-data"

export function RecentActivity() {
  return (
    <Card className="flex flex-col bg-black">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest beat views and purchases</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Beat</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px] font-medium bg-muted text-muted-foreground">
                        {item.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{item.user}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.beat}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.action === "purchased" ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {item.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.amount ?? <span className="text-muted-foreground">--</span>}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {item.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

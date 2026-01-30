"use client"

import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, MoreHorizontal, Globe, Lock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Log } from "@/types"

interface LogCardProps {
  log: Log
  showAuthor?: boolean
  showFullContent?: boolean
}

export function LogCard({ log, showAuthor = false, showFullContent = false }: LogCardProps) {
  const timeAgo = formatDistanceToNow(new Date(log.date), {
    addSuffix: true,
    locale: ko,
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showAuthor && log.user && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={log.user.image || undefined} />
                <AvatarFallback>{log.user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              {showAuthor && log.user && (
                <span className="text-sm font-medium">{log.user.name}</span>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{timeAgo}</span>
                {log.isPublic ? (
                  <Globe className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>수정</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/logs/${log.id}`}>
          <p className={showFullContent ? "" : "line-clamp-3"}>
            {log.content}
          </p>
        </Link>
        {log.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {log.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2">
            <Heart className="h-4 w-4" />
            <span>{log._count?.likes || 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>0</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

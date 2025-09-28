import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="パンくずリスト"
      className={cn("flex items-center space-x-1 text-sm text-gray-600", className)}
    >
      <Link href="/" className="flex items-center text-gray-500 hover:text-slate-600 transition-colors">
        <Home className="h-4 w-4" />
        <span className="sr-only">ホーム</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href && !item.isActive ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-slate-600 transition-colors truncate max-w-[120px]"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                "truncate max-w-[120px]",
                item.isActive ? "text-slate-700 font-medium" : "text-gray-500"
              )}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

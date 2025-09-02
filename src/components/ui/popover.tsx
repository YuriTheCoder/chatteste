import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  sideOffset?: number
}

const PopoverContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement> | null
}>({
  open: false,
  onOpenChange: () => {},
  triggerRef: null,
})

export const Popover: React.FC<PopoverProps> = ({
  open = false,
  onOpenChange = () => {},
  children,
}) => {
  const triggerRef = React.useRef<HTMLElement>(null)
  
  return (
    <PopoverContext.Provider value={{ open, onOpenChange, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ onClick, children, asChild, ...props }, ref) => {
  const { onOpenChange, triggerRef } = React.useContext(PopoverContext)
  
  React.useImperativeHandle(triggerRef, () => ref as any)
  
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick?.(e as any)
    onOpenChange(true)
  }
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      ref,
      onClick: handleClick,
    })
  }
  
  return (
    <button
      ref={ref}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
    const { open, onOpenChange, triggerRef } = React.useContext(PopoverContext)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    
    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)
    
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          triggerRef?.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          onOpenChange(false)
        }
      }
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false)
      }
      
      if (open) {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        
        // Calculate position
        if (triggerRef?.current) {
          const rect = triggerRef.current.getBoundingClientRect()
          const contentWidth = 320 // Approximate width
          
          let left = rect.left
          if (align === "center") {
            left = rect.left + rect.width / 2 - contentWidth / 2
          } else if (align === "end") {
            left = rect.right - contentWidth
          }
          
          // Ensure it stays within viewport
          left = Math.max(8, Math.min(left, window.innerWidth - contentWidth - 8))
          
          setPosition({
            top: rect.bottom + sideOffset,
            left,
          })
        }
      }
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }, [open, onOpenChange, triggerRef, align, sideOffset])
    
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              zIndex: 50,
            }}
            className={cn(
              "w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
              className
            )}
            {...props}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
PopoverContent.displayName = "PopoverContent"
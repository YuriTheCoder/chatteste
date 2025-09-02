import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

export const Dialog: React.FC<DialogProps> = ({
  open = false,
  onOpenChange = () => {},
  children,
}) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ onClick, children, asChild, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)
  
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
DialogTrigger.displayName = "DialogTrigger"

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, showCloseButton = true, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext)
    
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onOpenChange(false)
      }
      
      if (open) {
        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"
      }
      
      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = ""
      }
    }, [open, onOpenChange])
    
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => onOpenChange(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg max-h-[90vh] overflow-y-auto",
                  className
                )}
                onClick={(e) => e.stopPropagation()}
                {...props}
              >
                {children}
                {showCloseButton && (
                  <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </button>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    )
  }
)
DialogContent.displayName = "DialogContent"

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

export const DialogTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"
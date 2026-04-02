"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Step {
  id: string
  title: string
  description?: string
  content: React.ReactNode
}

export interface StepWizardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  steps: Step[]
  currentStep?: number
  onStepChange?: (step: number) => void
}

export const StepWizard = React.forwardRef<HTMLDivElement, StepWizardProps>(
  ({ className, steps, currentStep = 0, onStepChange, ...props }, ref) => {
    const [internalStep, setInternalStep] = React.useState(currentStep)
    const activeStep = onStepChange !== undefined ? currentStep : internalStep

    const handleStepClick = (index: number) => {
      // Allow clicking back to completed steps
      if (index < activeStep) {
        if (!onStepChange) {
          setInternalStep(index)
        } else {
          onStepChange(index)
        }
      }
    }

    return (
      <div ref={ref} className={cn("flex flex-col space-y-6 w-full", className)} {...props}>
        {/* Stepper Header */}
        <div className="flex items-center justify-between w-full">
          {steps.map((step, index) => {
            const isCompleted = index < activeStep
            const isActive = index === activeStep

            return (
              <React.Fragment key={step.id}>
                <div
                  className={cn(
                    "flex flex-col items-center relative z-10",
                    isCompleted && "cursor-pointer"
                  )}
                  onClick={() => handleStepClick(index)}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-200",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isActive
                        ? "border-primary text-foreground bg-background"
                        : "border-muted text-muted-foreground bg-background"
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span
                    className={cn(
                      "absolute top-10 w-max text-xs font-medium text-center",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 px-4 z-0 relative top-[-10px]">
                    <div
                      className={cn(
                        "h-[2px] w-full rounded-full transition-colors duration-200",
                        index < activeStep ? "bg-primary" : "bg-border"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="pt-8">
          {steps[activeStep]?.content}
        </div>
      </div>
    )
  }
)
StepWizard.displayName = "StepWizard"
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
export const StepWizard = React.forwardRef(({ className, steps, currentStep = 0, onStepChange, ...props }, ref) => {
    const [internalStep, setInternalStep] = React.useState(currentStep);
    const activeStep = onStepChange !== undefined ? currentStep : internalStep;
    const handleStepClick = (index) => {
        // Allow clicking back to completed steps
        if (index < activeStep) {
            if (!onStepChange) {
                setInternalStep(index);
            }
            else {
                onStepChange(index);
            }
        }
    };
    return (_jsxs("div", { ref: ref, className: cn("flex flex-col space-y-6 w-full", className), ...props, children: [_jsx("div", { className: "flex items-center justify-between w-full", children: steps.map((step, index) => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
                    return (_jsxs(React.Fragment, { children: [_jsxs("div", { className: cn("flex flex-col items-center relative z-10", isCompleted && "cursor-pointer"), onClick: () => handleStepClick(index), children: [_jsx("div", { className: cn("flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-200", isCompleted
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : isActive
                                                ? "border-primary text-foreground bg-background"
                                                : "border-muted text-muted-foreground bg-background"), children: isCompleted ? _jsx(Check, { className: "h-4 w-4" }) : index + 1 }), _jsx("span", { className: cn("absolute top-10 w-max text-xs font-medium text-center", isActive ? "text-foreground" : "text-muted-foreground"), children: step.title })] }), index < steps.length - 1 && (_jsx("div", { className: "flex-1 px-4 z-0 relative top-[-10px]", children: _jsx("div", { className: cn("h-[2px] w-full rounded-full transition-colors duration-200", index < activeStep ? "bg-primary" : "bg-border") }) }))] }, step.id));
                }) }), _jsx("div", { className: "pt-8", children: steps[activeStep]?.content })] }));
});
StepWizard.displayName = "StepWizard";

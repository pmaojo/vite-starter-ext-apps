import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/components/ui/card";

interface ActionCardProps {
  title: string;
  description: string;
  buttonText?: string;
  onAction: () => void;
}

export function ActionCard({
  title,
  description,
  buttonText = "Execute",
  onAction,
}: ActionCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Content area if needed later */}
      </CardContent>
      <CardFooter>
        <Button onClick={onAction} className="w-full">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

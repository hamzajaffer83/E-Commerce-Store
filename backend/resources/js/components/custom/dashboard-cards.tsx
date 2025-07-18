import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type Props = {
    heading: string;
    badge?: string;
    number: string | number;
    desc1: string;
    desc2: string
};

export default function DashboardCard({
    heading,
    badge,
    number,
    desc1,
    desc2
}: Props) {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{heading}</CardDescription>
                <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
                    {number}
                </CardTitle>
                {badge && (
                    <CardAction>
                        <Badge variant="outline">
                            {badge}
                        </Badge>
                    </CardAction>
                )}

            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {desc1}
                </div>
                <div className="text-muted-foreground">
                    {desc2}
                </div>
            </CardFooter>
        </Card>
    );
}